
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
        thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/1377/1377194.png"
    }, {
        title: "Mango Salsa",
        prepTime: 50,
        thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/1377/1377194.png"
    }, {
        title: "Mango Salsa",
        prepTime: 50,
        thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/1377/1377194.png"
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
