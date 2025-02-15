import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Default Vite frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection configuration
MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME")

# Create a database client
client = AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]


# Pydantic model for Item
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(gt=0, default=None)
    quantity: Optional[int] = Field(ge=0, default=None)


class ItemInDB(ItemBase):
    id: str

    class Config:
        from_attributes = True


# Helper function to convert MongoDB _id to string
def convert_mongodb_id(item: dict) -> dict:
    item["id"] = str(item.pop("_id"))
    return item


# CRUD Operations
@app.post("/api/items", response_model=ItemInDB)
async def create_item(item: ItemCreate):
    item_dict = item.model_dump()
    result = await db.items.insert_one(item_dict)
    created_item = await db.items.find_one({"_id": result.inserted_id})
    return convert_mongodb_id(created_item)


@app.get("/api/items", response_model=List[ItemInDB])
async def get_items():
    items = []
    cursor = db.items.find({})
    async for document in cursor:
        items.append(convert_mongodb_id(document))
    return items


@app.get("/api/items/{item_id}", response_model=ItemInDB)
async def get_item(item_id: str):
    try:
        item = await db.items.find_one({"_id": ObjectId(item_id)})
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        return convert_mongodb_id(item)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid item ID")


@app.put("/api/items/{item_id}", response_model=ItemInDB)
async def update_item(item_id: str, item_update: ItemUpdate):
    update_data = {k: v for k, v in item_update.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid update data provided")

    try:
        result = await db.items.update_one(
            {"_id": ObjectId(item_id)}, {"$set": update_data}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")

        updated_item = await db.items.find_one({"_id": ObjectId(item_id)})
        return convert_mongodb_id(updated_item)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid item ID")


@app.delete("/api/items/{item_id}")
async def delete_item(item_id: str):
    try:
        result = await db.items.delete_one({"_id": ObjectId(item_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"message": "Item deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid item ID")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/greeting")
async def greeting():
    return {"message": "Hello from FastAPI!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
