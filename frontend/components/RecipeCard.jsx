import PropTypes from "prop-types";
import { Clock } from "lucide-react";

const RecipeCard = ({ title, prepTime, thumbnailUrl }) => {
    return (
        <div className="flex items-center space-x-4 p-3 bg-gray-100 my-2 rounded-2xl">
            {/* Image Container */}
            <div className="w-25 h-20 bg-red-900 rounded-lg overflow-hidden">
                <img
                    src={thumbnailUrl || "/placeholder.svg"}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Recipe Info */}
            <div>
                {/* Prep Time */}
                <div className="flex items-center text-gray-700 text-sm font-medium">
                    <Clock size={14} className="mr-1" />
                    {prepTime} minutes
                </div>

                {/* Recipe Title */}
                <h2 className="text-lg font-bold">{title}</h2>
            </div>
        </div>
    );
};

// ✅ PropTypes for validation
RecipeCard.propTypes = {
    title: PropTypes.string.isRequired,
    prepTime: PropTypes.number.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
};

export default RecipeCard;
