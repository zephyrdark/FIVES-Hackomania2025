import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { adjustRecipe } from "../api";

const RecipeDetails = ({ recipe, setRecipe }) => {
  // Initialize state with the passed recipe
  const [currentRecipe, setCurrentRecipe] = useState(recipe || {});
  const [previousRecipe, setPreviousRecipe] = useState(recipe || {});

  useEffect(() => {
    console.log("recipe", recipe);
    setCurrentRecipe(recipe);
  }, [recipe]);

  const [isModifying, setIsModifying] = useState(false);
  const [modificationText, setModificationText] = useState('');
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients', 'instructions', 'notes'
  const [error, setError] = useState(false);

  // Helper: Parse a quantity. If it's a fraction string like "1/2", convert it to a number.
  const parseQuantity = (quantity) => {
    if (typeof quantity === 'number') return quantity;
    if (typeof quantity === 'string') {
      if (quantity.includes('/')) {
        const parts = quantity.split('/');
        if (parts.length === 2) {
          const numerator = Number(parts[0].trim());
          const denominator = Number(parts[1].trim());
          if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            return numerator / denominator;
          }
        }
      }
      const parsed = Number(quantity);
      if (!isNaN(parsed)) return parsed;
    }
    return NaN;
  };

  // This function attempts to auto-correct common issues in the recipe
  const sanitizeRecipe = (recipe) => {
    // Create a shallow copy so we don't mutate the original object directly.
    const sanitized = { ...recipe };

    // Correct name: if empty or not a string, set a default name.
    if (!sanitized.name || typeof sanitized.name !== 'string' || sanitized.name.trim() === '') {
      sanitized.name = "Unnamed Recipe";
    }

    // Correct servings: if it's not a valid number, default to 1.
    if (!Number.isFinite(sanitized.servings)) {
      sanitized.servings = 1;
    }

    // Correct ingredients: ensure it is an array and sanitize each ingredient.
    if (!Array.isArray(sanitized.ingredients)) {
      sanitized.ingredients = [];
    } else {
      sanitized.ingredients = sanitized.ingredients.map((ingredient, index) => {
        const newIngredient = { ...ingredient };
        if (!newIngredient.name || typeof newIngredient.name !== 'string' || newIngredient.name.trim() === '') {
          newIngredient.name = `Ingredient ${index + 1}`;
        }
        // Parse the quantity. If parsing fails, default to 1.
        newIngredient.quantity = parseQuantity(newIngredient.quantity);
        if (!Number.isFinite(newIngredient.quantity)) {
          newIngredient.quantity = 1;
        }
        if (typeof newIngredient.unit !== 'string') {
          newIngredient.unit = "";
        }
        return newIngredient;
      });
    }

    // Correct instructions: ensure it is an array and sanitize each instruction.
    if (!Array.isArray(sanitized.instructions)) {
      sanitized.instructions = [];
    } else {
      sanitized.instructions = sanitized.instructions.map((instruction, index) => {
        const newInstruction = { ...instruction };
        // If step is missing or invalid, set it to the correct order.
        if (!Number.isFinite(newInstruction.step)) {
          newInstruction.step = index + 1;
        }
        // If description is empty, add a default text.
        if (!newInstruction.description || typeof newInstruction.description !== 'string' || newInstruction.description.trim() === '') {
          newInstruction.description = "No description provided.";
        }
        return newInstruction;
      });
    }
    return sanitized;
  };

  // Validation function (kept similar to before) to ensure that the recipe meets the required format.
  const validateRecipe = (recipe) => {
    if (typeof recipe !== 'object' || recipe === null) {
      throw new Error("Invalid recipe format: Recipe is not an object.");
    }
    if (!recipe.name || typeof recipe.name !== 'string') {
      throw new Error("Invalid recipe: 'name' must be a non-empty string.");
    }
    if (!Number.isFinite(recipe.servings)) {
      throw new Error("Invalid recipe: 'servings' must be a valid number.");
    }
    if (!Array.isArray(recipe.ingredients)) {
      throw new Error("Invalid recipe: 'ingredients' must be an array.");
    }
    recipe.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name || typeof ingredient.name !== 'string') {
        throw new Error(`Invalid ingredient at index ${index}: 'name' must be a non-empty string.`);
      }
      if (!Number.isFinite(ingredient.quantity)) {
        throw new Error(
          `Invalid ingredient at index ${index}: 'quantity' must be a valid number. Received: ${ingredient.quantity}`
        );
      }
      if (typeof ingredient.unit !== 'string') {
        throw new Error(`Invalid ingredient at index ${index}: 'unit' must be a string.`);
      }
    });
    if (!Array.isArray(recipe.instructions)) {
      throw new Error("Invalid recipe: 'instructions' must be an array.");
    }
    recipe.instructions.forEach((instruction, index) => {
      if (!Number.isFinite(instruction.step)) {
        throw new Error(`Invalid instruction at index ${index}: 'step' must be a valid number.`);
      }
      if (typeof instruction.description !== 'string' || instruction.description.trim() === '') {
        throw new Error(`Invalid instruction at index ${index}: 'description' must be a non-empty string.`);
      }
    });
    return true;
  };

  const handleModifyClick = () => {
    setIsModifying(!isModifying);
  };

  // Make handleSubmitClick asynchronous to properly wait for the API call.
  const handleSubmitClick = async () => {
    if (modificationText === '') {
      return;
    }

    try {
      // Save the current recipe in case we need to revert.
      setPreviousRecipe(currentRecipe);

      // Prepare the payload for the API call.
      const payload = {
        recipe: currentRecipe,
        query: "Please suggest another healthy recipe based on my feedback: " + modificationText,
      };

      // Await the API call (adjustRecipe returns a promise).
      const response = await adjustRecipe(payload);
      
      console.log("response", response);
      // Check if the API response contains an updated_recipe property.
      if (!response || !response.updated_recipe) {
        throw new Error("Invalid API response");
      }

      let updatedRecipeStr = response.updated_recipe;
      console.log("Before parsing, updatedRecipeStr:", updatedRecipeStr);
      
      // Parse the string into an object.
      const updatedRecipeParsed = updatedRecipeStr;

      // Auto-correct common issues.
      const correctedRecipe = sanitizeRecipe(updatedRecipeParsed);

      // Optionally, validate the corrected recipe.
      validateRecipe(correctedRecipe);

      console.log("Corrected Recipe:", correctedRecipe);
      setRecipe(correctedRecipe);
      setModificationText('');
      setIsModifying(false); // Hide the modify text input field.
      setError(false);
    } catch (err) {
      console.error("Error updating recipe:", err);
      setCurrentRecipe(previousRecipe);
      setError(true);
      setIsModifying(false); // Optionally hide it even on error, or leave it open.
    }
  };

  return (
    <>
      {currentRecipe ? (
        <div className="mt-10 flex flex-col container">
          {/* Name */}
          <h1>{currentRecipe.name}</h1>

          {/* Modify */}
          {isModifying ? (
            <div className="w-full flex flex-wrap items-center my-1">
              <button className="mx-5 w-28 text-white" onClick={handleModifyClick}>
                Modify AI
              </button>
              <button className="mx-6 w-28 text-white" onClick={handleSubmitClick}>
                Submit
              </button>
              <input
                className="w-full h-25 px-2 border border-gray-300 rounded"
                type="text"
                value={modificationText}
                onChange={(e) => {
                  console.log(e.target.value); // Log the modification text for debugging.
                  setModificationText(e.target.value);
                }}
                placeholder="Please share with me anything else."
              />
            </div>
          ) : (
            <button onClick={handleModifyClick} className="text-white">Modify AI</button>
          )}

          <div className="flex flex-col">
            {/* BUTTONS: Ingredients, Instructions, Notes */}
            <div className="flex space-x-4 my-4">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`text-white text-sm ${activeTab === 'ingredients' ? 'font-bold' : ''}`}
                style={{ fontSize: '14px' }}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`text-white text-sm ${activeTab === 'instructions' ? 'font-bold' : ''}`}
                style={{ fontSize: '14px' }}
              >
                Instructions
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`text-white text-sm ${activeTab === 'notes' ? 'font-bold' : ''}`}
                style={{ fontSize: '14px' }}
              >
                Notes
              </button>
            </div>

            {/* Servings */}
            <button className="text-white">Servings: {currentRecipe.servings}</button>

            {/* TABS: Ingredients */}
            {activeTab === 'ingredients' && (
              <>
                <h2 className="font-bold">Ingredients</h2>
                {currentRecipe.ingredients ? (
                  <ul>
                    {currentRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        <div className="flex justify-between items-center">
                          <div className="text-left">{ingredient.name}</div>
                          <div className="text-right">
                            {ingredient.quantity} {ingredient.unit}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul>
                    <li>No ingredients available.</li>
                  </ul>
                )}
              </>
            )}

            {/* TABS: Instructions */}
            {activeTab === 'instructions' && (
              <>
                <h2 className="font-bold">Instructions</h2>
                <ol>
                  {currentRecipe.instructions.map((instruction, index) => (
                    <li key={index}>
                      <strong>Step {instruction.step}:</strong> {instruction.description}
                    </li>
                  ))}
                </ol>
              </>
            )}

            {/* TABS: Notes */}
            {activeTab === 'notes' && (
              <>
                <h2 className="font-bold">Notes</h2>
                <p>No notes available.</p>
              </>
            )}
          </div>
        </div>
      ) : error ? (
        <div
          className="w-full bg-red-500 text-black p-3 rounded-lg text-center font-semibold hover:bg-blue-600 transition duration-300 mb-15 mt-5"
          onClick={() => {
            setCurrentRecipe(previousRecipe);
            setError(false);
          }}
        >
          An error has occurred! Retry?
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

RecipeDetails.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    servings: PropTypes.number.isRequired,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
      })
    ).isRequired,
    instructions: PropTypes.arrayOf(
      PropTypes.shape({
        step: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default RecipeDetails;
