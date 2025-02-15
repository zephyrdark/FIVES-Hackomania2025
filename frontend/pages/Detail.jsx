import RecipeDetails from "../components/RecipeDetails";
import Header from "../components/Header.jsx";

export default function Detail() {
    const recipe = location.state?.recipe; // Optional chaining in case state is undefined

    const mockRecipe = {
        name: "Spaghetti Carbonara",
        servings: 4,
        ingredients: [
            { name: "spaghetti", quantity: 400, unit: "grams" },
            { name: "bacon", quantity: 150, unit: "grams" },
            { name: "eggs", quantity: 4, unit: "pieces" },
            { name: "parmesan cheese", quantity: 100, unit: "grams" },
            { name: "black pepper", quantity: 1, unit: "tsp" },
            { name: "salt", quantity: 1, unit: "tsp" }
        ],
        instructions: [
            { step: 1, description: "Boil water and cook spaghetti until al dente." },
            { step: 2, description: "Fry bacon until crispy." },
            { step: 3, description: "Mix eggs, parmesan, and pepper in a bowl." },
            { step: 4, description: "Combine spaghetti, bacon, and egg mixture quickly." },
            { step: 5, description: "Adjust with reserved water, season, and serve." }
        ]
    };

    return (
        <div className="min-h-screen -mx-1 container">
            <Header
                pageName={"Recipe Details"} >
            </Header>

            <div>
                {recipe ? (
                    <RecipeDetails
                        recipe={recipe}
                        modifyFunction={() => {}}
                    />
                ) : (
                    <RecipeDetails
                        recipe={mockRecipe}
                        modifyFunction={() => {}}
                    />
                )}
            </div>
        </div>
    )
}