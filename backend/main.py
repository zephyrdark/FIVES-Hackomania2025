from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import ollama

# --- Model Selection ---
MODEL_NAME = "llama3.2"
# MODEL_NAME = "mixtral"

# --- Node Definitions for Conversation Flow ---
class Node:
    """A simple node in our language graph."""
    def run(self, **kwargs):
        raise NotImplementedError("Must implement run()")

class PromptNode(Node):
    """Returns a prompt message."""
    def __init__(self, prompt_text):
        self.prompt_text = prompt_text

    def run(self, **kwargs):
        return self.prompt_text

class UpdateContextNode(Node):
    """Updates the context (wall-of-text) with the latest user input."""
    def run(self, context, user_input, **kwargs):
        # Append the new input to the existing context.
        updated_context = context + f"\nUser: {user_input}"
        return updated_context

class OllamaNode(Node):
    """Calls Ollama with a given system instruction and prompt."""
    def __init__(self, system_instruction):
        self.system_instruction = system_instruction

    def run(self, prompt):
        messages = [
            {"role": "system", "content": self.system_instruction},
            {"role": "user", "content": prompt}
        ]
        response = ollama.chat(model=MODEL_NAME, messages=messages)
        return response['message']['content']

# Helper function to determine if context is sufficient
def is_context_sufficient(context):
    system_instruction = (
        "You are an assistant that evaluates conversation context for recipe generation. "
        "The context is sufficient if it is predictive of a recipe. "
        "Please answer only with 'YES' or 'NO'."
    )
    sufficiency_node = OllamaNode(system_instruction)
    response = sufficiency_node.run(prompt=context)
    return "YES" in response.upper()

# --- Global Conversation State ---
# Since it's a single-user scenario, we can store the conversation context and round count in globals.
conversation_state = {"context": "", "rounds": 0}
MIN_ROUNDS = 4  # As defined in your AI flow

# --- Node Instances for Conversation Flow ---
initial_prompt_node = PromptNode("Welcome to CuisineQuest! What type of cuisine are you craving?")
update_context_node = UpdateContextNode()

clarifying_node = OllamaNode(
    "You are an assistant that asks clarifying questions to gather additional recipe preferences. "
    "Based on the conversation context so far, produce a clarifying question to obtain more details."
)

recipe_node = OllamaNode(
"""
You are a JSON recipe generator. Output only valid, properly formatted JSON with no additional text or explanations.

Follow this exact structure:
{
  "recipe": {
    "name": "Recipe Name",
    "servings": integer,
    "ingredients": [
      {"name": "ingredient", "quantity": number, "unit": "unit"}
    ],
    "instructions": [
      {"step": integer, "description": "step description"}
    ]
  }
}

Rules:
- Ensure "name" is a string.
- "servings" should be a positive integer.
- Each ingredient must have a "name" (string), "quantity" (float or integer), and "unit" (string).
- Instructions should be an array of objects, each containing "step" (integer, sequential) and "description" (string).
- Ensure valid JSON formatting with proper indentation with the following example:

{
  "recipe": {
    "name": "Pancakes",
    "servings": "4",
    "ingredients": [
      {"name": "Flour", "quantity": "2", "unit": "cups"},
      {"name": "Milk", "quantity": "1.5", "unit": "cups"},
      {"name": "Eggs", "quantity": "2", "unit": "pieces"},
      {"name": "Baking Powder", "quantity": "1", "unit": "tablespoon"},
      {"name": "Salt", "quantity": "0.5", "unit": "teaspoon"}
    ],
    "instructions": [
      {"step": 1, "description": "In a large bowl, mix the flour, baking powder, and salt."},
      {"step": 2, "description": "Add milk and eggs, then whisk until smooth."},
      {"step": 3, "description": "Heat a pan over medium heat and lightly grease it."},
      {"step": 4, "description": "Pour batter onto the pan and cook until bubbles form, then flip."},
      {"step": 5, "description": "Cook until golden brown, then serve."}
    ]
  }
}
"""
)

# --- Ollama-based Recipe Update Function ---
def update_recipe(recipe: str, query: str) -> str:
    """
    Calls the Ollama model with a prompt that instructs it to update the recipe JSON
    based on the user query.

    :param recipe: A string containing the recipe in JSON format.
    :param query: A natural language query describing what modification is required.
    :return: The updated recipe JSON as a string.
    """
    system_message = (
        "You are a helpful AI assistant that provides answers only in JSON format and nothing else."
    )
    
    # Construct a prompt that includes both the recipe and the query
    prompt = (
        f"Here is a recipe in JSON format:\n{recipe}\n\n"
        f"User query: {query}\n\n"
        "Please update the recipe accordingly and return the updated JSON."
    )
    
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": prompt}
    ]
    
    response = ollama.chat(model=MODEL_NAME, messages=messages)
    return response['message']['content']

# --- FastAPI Application Setup ---
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Conversation Endpoints ---
@app.get("/conversation/start")
def start_conversation():
    """
    Resets the conversation state and returns the initial prompt.
    """
    global conversation_state
    conversation_state = {"context": "", "rounds": 0}
    prompt = initial_prompt_node.run()
    return {"response_type": "question", "message": prompt}

@app.post("/conversation")
def continue_conversation(payload: dict):
    """
    Receives user input, updates the conversation context, and either returns
    a clarifying question or, if the context is sufficient, a recipe in JSON format.
    
    Expected Request Body (JSON):
    {
      "user_input": "I love spicy Asian cuisine."
    }
    
    Response Body (JSON) if recipe not ready:
    { "response_type": "question", "message": "Any specific proteins you like?" }
    
    Response Body (JSON) if recipe ready:
    { "response_type": "recipe", "recipe_json": { ... } }
    """
    global conversation_state

    user_input = payload.get("user_input", "")
    if not user_input:
        return {"error": "user_input is required."}
    
    # Update context and round count
    conversation_state["context"] = update_context_node.run(
        context=conversation_state["context"],
        user_input=user_input
    )
    conversation_state["rounds"] += 1

    # Check if recipe generation criteria are met
    if conversation_state["rounds"] >= MIN_ROUNDS and is_context_sufficient(conversation_state["context"]):
        recipe = recipe_node.run(prompt=conversation_state["context"])
        # Optionally, try to parse the recipe into JSON
        try:
            recipe_json = json.loads(recipe)
        except Exception:
            recipe_json = recipe  # Fallback to raw string if JSON parsing fails

        # Reset conversation after generating the recipe
        conversation_state = {"context": "", "rounds": 0}
        return {"response_type": "recipe", "recipe_json": recipe_json}
    else:
        # Otherwise, get a clarifying question to continue building context
        clarifying_question = clarifying_node.run(prompt=conversation_state["context"])
        return {"response_type": "question", "message": clarifying_question}

# --- Recipe Adjustment Endpoint ---
@app.post("/adjust")
def adjust_recipe(payload: dict):
    """
    Updates a given recipe JSON based on the user's query.

    Expected Request Body (JSON):
    {
      "recipe": "<the JSON in string form or as an object>",
      "query": "I want more meat in this recipe."
    }

    Response Body (JSON); please strictly follow the keys: updated_recipe, recipe, name, servings, ingredients, instructions. Please also do not add additional keys:
    "updated_recipe": {
        "recipe": {
            "name": "Recipe Name",
            "servings": "integer",
            "ingredients": [
                {"name": "ingredient", "quantity": "number", "unit": "unit"}
            ],
            "instructions": [
                {"step": "integer", "description": "step description"}
            ]
        }
    }
    """
    recipe = payload.get("recipe")
    query = payload.get("query")
    if not recipe or not query:
        return {"error": "Both 'recipe' and 'query' are required."}
    
    # If the recipe is provided as a dict, convert it to a string.
    if isinstance(recipe, dict):
        recipe_str = json.dumps(recipe)
    else:
        recipe_str = recipe

    updated_recipe_str = update_recipe(recipe_str, query)
    
    # Attempt to parse the updated recipe into JSON; fallback to string if parsing fails.
    try:
        updated_recipe_obj = json.loads(updated_recipe_str)
    except Exception:
        updated_recipe_obj = updated_recipe_str

    return {"updated_recipe": updated_recipe_obj}

# --- Additional Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.on_event("startup")
async def startup_event():
    print("Available routes in FastAPI:")
    for route in app.routes:
        print(f"Path: {route.path}, Methods: {route.methods}")
