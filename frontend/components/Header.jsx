import PropTypes from "prop-types"; // Import PropTypes

const Header = ({ pageName, children }) => {
    return (
        <header className="bg-orange-600 px-8 pt-4 pb-3 shadow-sm fixed top-0 left-0 right-0 z-50">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-white">{pageName}</div>
            </div>
            {children}
        </header>
    );
};

// ✅ Add PropTypes for validation
Header.propTypes = {
    pageName: PropTypes.string.isRequired, // Ensures pageName is a required string
    children: PropTypes.node, // Allows any valid React node (optional)
};

export default Header;
