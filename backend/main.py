import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
import logging
from dotenv import load_dotenv
load_dotenv()
logger = logging.getLogger('uvicorn')
app = FastAPI()

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Default Vite frontend port
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


# Helper function to convert MongoDB _id to string
def convert_mongodb_id(item: dict) -> dict:
    # item["id"] = str(item.pop("_id"))
    item.pop("_id")
    return item


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
