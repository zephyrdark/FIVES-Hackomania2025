import PropTypes from "prop-types";
import MobileNavigation from "./NavBar";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-white text-black container mx-auto">
            {/* Content Section */}
            <div className="flex-grow bg-white container mx-auto">{children}</div>

            {/* Fixed Bottom Navigation */}
            <MobileNavigation />
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
