import PropTypes from "prop-types";
import { Clock, Flame } from "lucide-react";

const RecipeCard = ({ id, title, cuisine, prepTime, spicy, thumbnailUrl }) => {
    console.log(id)
    console.log(thumbnailUrl)
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm">
            {/* Image Section */}
            <div className="relative h-48">
                <img
                    src={thumbnailUrl }
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 mb-4">{cuisine} Cuisine</p>

                {/* Prep Time & Spicy Indicator */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-500">{prepTime} mins</span>
                    </div>

                    {spicy && (
                        <div className="flex items-center">
                            <Flame className="w-4 h-4 mr-1 text-red-500" />
                            <span className="text-sm text-red-500">Spicy</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ✅ Add PropTypes for Validation
RecipeCard.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cuisine: PropTypes.string.isRequired,
    prepTime: PropTypes.number.isRequired,
    spicy: PropTypes.bool.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
};

export default RecipeCard;
