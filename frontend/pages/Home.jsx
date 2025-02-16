
import { Search } from "lucide-react";
import Header from "../components/Header"; // Import the Header component
import RecipeCard from "../components/RecipeCard";
import { useNavigate } from "react-router-dom";
import RecipeCard2 from "../components/RecipeCard2";
import { useState } from "react";

export default function Home() {

    const navigate = useNavigate()
    const testRecipes = [{
        title: "Mango Salsa",
        prepTime: 50,
        thumbnailUrl: "data:image/jpeg;base64,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"
    }, {
        title: "Mango Salsa",
        prepTime: 50,
        thumbnailUrl: "data:image/jpeg;base64,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"
    }, {
        title: "Mango Salsa",
        prepTime: 50,
        thumbnailUrl: "data:image/jpeg;base64,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"
    }]

    return (
        <div className="min-h-screen px-3 py-10">
            <Header pageName={"Explore Recipes"} >
            </Header>

            <div className="  flex items-center gap-3">
                {/* Search Bar */}
                <div className="flex items-center bg-gray-200 px-3 py-2 rounded-full w-full">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search Recipe"
                        className="ml-2 bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                    />
                </div>
            </div>

            {/* SMARTEATS Button */}
            <div className="bg-orange-500 btn-active shadow-md px-3 mt-2 py-2 text-lg rounded-lg text-white font-medium text-bold"
                 onClick={() => navigate('/smart')}
            >
                I'm feeling Hungry
            </div>

            {/* List view - Recipes */}
            {testRecipes.map((recipe, index) => (
                <RecipeCard
                    key={index}
                    title={recipe.title}
                    prepTime={recipe.prepTime}
                    thumbnailUrl={recipe.thumbnailUrl}
                />
            ))}
            <div className="flex justify-center mt-4">
                <button className="text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-black font-small px-5 py-2 rounded-full transition">
                    SHOW MORE
                </button>
            </div>
        </div>

    );
}
