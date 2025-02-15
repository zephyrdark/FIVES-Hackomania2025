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
    # item["id"] = str(item.pop("_id"))
    item.pop("_id")
    return item


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


# Pydantic model for Question
class QuestionOption(BaseModel):
    value: str
    label: str


class Question(BaseModel):
    question_id: str
    text: str
    type: str
    options: List[QuestionOption]


# Smart Eats
@app.get("/api/smart/questions", response_model=List[Question])
async def get_questions():
    questions = []
    cursor = db.questions.find({})
    async for document in cursor:
        questions.append(convert_mongodb_id(document))
    return questions


class AskedQuestions(BaseModel):
    asked_questions_id: List[str]


@app.post("/api/smart/questions/others", response_model=List[Question])
async def get_questions_other_than(asked_questions: AskedQuestions):
    questions = []
    # Use the $nin operator to exclude the provided question IDs and limit the result to 3
    cursor = db.questions.find({"question_id": {"$nin": asked_questions.asked_questions_id}}).limit(3)
    async for document in cursor:
        questions.append(convert_mongodb_id(document))
    return questions


class Answer(BaseModel):
    question_id: str
    answer: str


class AnswersPostRequest(BaseModel):
    userId: str
    answers: List[Answer]


feedbackQuestion = {
    "question_id": "q0",
    "text": "Are you happy with this suggestion?",
    "type": "single-choice",
    "options": [
        {"value": "yes", "label": "Yes"},
        {"value": "no", "label": "No"},
    ]
}


class Option(BaseModel):
    value: str
    label: str


class SuggestedRecipe(BaseModel):
    recipe_id: str
    title: str
    thumbnailUrl: str
    options: List[Option]


class FeedbackQuestion(BaseModel):
    question_id: str
    text: str
    type: str
    options: List[Option]


class RecipeSuggestionResponse(BaseModel):
    suggested_recipe: SuggestedRecipe
    feedback_question: FeedbackQuestion


# POST endpoint for submitting answers
@app.post("/api/smart/answers", response_model=RecipeSuggestionResponse)
async def submit_answers(request: AnswersPostRequest):
    # TODO: use the user's answers to determine which recipe to fetch.
    # For the mock, we're always fetching recipe with id "1".
    recipe = await get_recipe("1")
    response = {
        "suggested_recipe": recipe,
        "feedback_question": feedbackQuestion
    }
    return response


# Helper function to fetch a recipe from the database
async def get_recipe(recipe_id: str):
    recipe = await db.recipes.find_one({"recipe_id": recipe_id})
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return convert_mongodb_id(recipe)


# Endpoint to get a recipe (if needed separately)
@app.get("/api/recipe/{recipe_id}", response_model=SuggestedRecipe)
async def get_recipe_endpoint(recipe_id: str):
    return await get_recipe(recipe_id)


# TODO: pass ingredient_id and recipe_id to make custom_recipe


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
