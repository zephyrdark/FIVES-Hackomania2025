import PropTypes from "prop-types";
// import { useState } from "react";
import { Clock } from "lucide-react";

const RecipeCard = ({ title, prepTime, thumbnailUrl, onAddToCookbook, onClose, open }) => {
    return (
        <div className={`fixed inset-0 bg-[rgba(0,0,0,0.3)] flex justify-center items-center z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>

            <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-lg relative">
                {/* Close Button */}
                {/* <div
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    ✖
                </div> */}

                {/* Title */}
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
                        src={thumbnailUrl || "https://cdn-icons-png.flaticon.com/512/1377/1377194.png"}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Recipe Details */}


                {/* Add to Cookbook Buttons */}
                <div className="flex justify-center gap-4 mt-4">

                    <div
                        className="bg-green-500 text-white px-4 py-2 rounded-md font-bold"
                        onClick={() => onAddToCookbook(true)}
                    >
                        Proceed to Recipe
                    </div>

                </div>

                <div
                    className="text-black px-4 py-1 rounded-md text-xs"
                    onClick={() => onClose()}
                >
                    Continue exploring
                </div>
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
};

export default RecipeCard;
