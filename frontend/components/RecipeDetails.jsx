import PropTypes from 'prop-types';
import {useEffect, useState} from "react";
import { adjustRecipe } from "../api";

const RecipeDetails = ({ recipe }) => {
    // Initialize state with the passed recipe
    const [currentRecipe, setCurrentRecipe] = useState(recipe);
    const [previousRecipe, setPreviousRecipe] = useState(recipe);
    // Destructure properties from currentRecipe
    const { name, servings, ingredients, instructions } = currentRecipe;

    const [isModifying, setIsModifying] = useState(false);
    const [modificationText, setModificationText] = useState('');
    const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients', 'instructions', 'notes'
    const [error, setError] = useState(false);

    const handleModifyClick = () => {
        setIsModifying(!isModifying);
    };

    // Make handleSubmitClick asynchronous to properly wait for the API call
    const handleSubmitClick = async () => {
        try {
            // Save the current recipe in case we need to revert
            setPreviousRecipe(currentRecipe);

            // Prepare the payload for the API call
            const payload = {
                recipe: currentRecipe,
                query: "Please suggest another healthy recipe based on my feedback: " + modificationText
            };

            // Await the API call (adjustRecipe returns a promise)
            const response = await adjustRecipe(payload);

            // Check if the API response contains an updated_recipe property
            if (!response || !response.updated_recipe) {
                throw new Error("Invalid API response");
            }
            setCurrentRecipe(response.updated_recipe);
            setModificationText('');
            setIsModifying(false); // This hides the modify text input field
            setError(false);
        } catch (err) {
            console.error("Error updating recipe:", err);
            setCurrentRecipe(previousRecipe);
            setError(true);
            setIsModifying(false); // Optionally hide it even on error, or leave it open
        }
    };

    return (
        <>
            {currentRecipe ? (
                <div className="mt-10 flex flex-col container">
                    {/* Name */}
                    <h1>{name}</h1>

                    {/* Modify */}
                    {isModifying ? (
                        <div className="w-full flex flex-wrap items-center my-1">
                            <button className="mx-5 w-28" onClick={handleModifyClick}>
                                Modify AI
                            </button>
                            <button className="mx-6 w-28" onClick={handleSubmitClick}>
                                Submit
                            </button>
                            <input
                                className="w-full h-25 px-2 border border-gray-300 rounded"
                                type="text"
                                value={modificationText}
                                onChange={(e) => {
                                    console.log(e.target.value); // Log the modification text for debugging
                                    setModificationText(e.target.value);
                                }}
                                placeholder="Please share with me anything else."
                            />
                        </div>
                    ) : (
                        <button onClick={handleModifyClick}>Modify AI</button>
                    )}

                    <div className="flex flex-col">
                        {/* BUTTONS: Ingredients, Instructions, Notes */}
                        <div className="flex space-x-4 my-4">
                            <button
                                onClick={() => setActiveTab('ingredients')}
                                className={`text-sm ${activeTab === 'ingredients' ? 'font-bold' : ''}`}
                                style={{ fontSize: '14px' }}
                            >
                                Ingredients
                            </button>
                            <button
                                onClick={() => setActiveTab('instructions')}
                                className={`text-sm ${activeTab === 'instructions' ? 'font-bold' : ''}`}
                                style={{ fontSize: '14px' }}
                            >
                                Instructions
                            </button>
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`text-sm ${activeTab === 'notes' ? 'font-bold' : ''}`}
                                style={{ fontSize: '14px' }}
                            >
                                Notes
                            </button>
                        </div>

                        {/* Servings */}
                        <button>Servings: {servings}</button>

                        {/* TABS: Ingredients */}
                        {activeTab === 'ingredients' && (
                            <>
                                <h2 className="font-bold">Ingredients</h2>
                                <ul>
                                    {ingredients.map((ingredient, index) => (
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
                            </>
                        )}
                        {/* TABS: Instructions */}
                        {activeTab === 'instructions' && (
                            <>
                                <h2 className="font-bold">Instructions</h2>
                                <ol>
                                    {instructions.map((instruction, index) => (
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
                unit: PropTypes.string.isRequired
            })
        ).isRequired,
        instructions: PropTypes.arrayOf(
            PropTypes.shape({
                step: PropTypes.number.isRequired,
                description: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired
};

export default RecipeDetails;
