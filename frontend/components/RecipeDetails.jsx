import PropTypes from 'prop-types';
import {useState} from "react";

const RecipeDetails = ({ recipe, modifyFunction }) => {
    const { name, servings, ingredients, instructions } = recipe;
    const [isModifying, setIsModifying] = useState(false);
    const [modificationText, setModificationText] = useState('');
    const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients', 'instructions', 'notes'

    const handleModifyClick = () => {
        setIsModifying(!isModifying);
    };

    const handleSubmitModification = () => {
        // Call the modifyFunction with the user's input
        modifyFunction(modificationText);
        // Optionally, clear the input and hide the text input box after submitting
        setModificationText('');
        setIsModifying(false);
    };

    return (
        <div className="mt-10 flex flex-col container">
            {/* Name */}
            <h1>{name}</h1>

            {/* Modify */}
            {isModifying ? (
                <div className="w-full flex flex-wrap items-center my-1">
                    <button
                        className="mx-5 w-28"
                        onClick={handleModifyClick}
                    >
                        Modify AI
                    </button>
                    <button
                        className="mx-6 w-28"
                        onClick={handleSubmitModification}
                    >
                        Submit
                    </button>
                    <input
                        className="w-full h-25 px-2 border border-gray-300 rounded"
                        type="text"
                        value={modificationText}
                        onChange={(e) => setModificationText(e.target.value)}
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
                                        <div className="text-right">{ingredient.quantity} {ingredient.unit}</div>
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
    }).isRequired,
    modifyFunction: PropTypes.func.isRequired,
};

export default RecipeDetails;
