import PropTypes from "prop-types";
// import { useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ title, prepTime, thumbnailUrl, recipe }) => {
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(`/detail
        `, { state: { recipe: recipe } })}>
            <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-lg relative">
                <h2 className="text-xl font-bold text-center">{title}</h2>
                {/* <p className="text-center text-gray-600">Could this be what you wanted?</p> */}

                <div className="mt-3 flex items-center justify-center text-sm text-gray-700">
                    <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{prepTime} minutes</span>
                    </div>
                    {/* <button className="bg-gray-200 px-3 py-1 rounded-md font-medium">
                        View Recipe
                    </button> */}
                </div>
                {/* Recipe Image */}
                <div className="w-full h-[200px] overflow-hidden rounded-lg mt-4">
                    <img
                        src={thumbnailUrl || "https://h7.alamy.com/comp/HT5DCX/man-with-gloves-working-with-tomato-in-genetic-engineering-laboratory-HT5DCX.jpg"}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Recipe Details */}

            </div>
        </div>
    );
};

// ✅ PropTypes for Validation
RecipeCard.propTypes = {
    title: PropTypes.string.isRequired,
    prepTime: PropTypes.number.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    onAddToCookbook: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    recipe: PropTypes.object.isRequired
};

export default RecipeCard;
