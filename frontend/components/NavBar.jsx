import PropTypes from "prop-types"; // Import PropTypes
import { Book, FileText, User } from "lucide-react";
import { Link } from "react-router-dom"; // Use React Router for navigation

const MobileNavigation = () => {
    return (
        <nav>
            <div>
                <NavItem to="/cookbook" icon={<Book size={24} />} label="Cookbook" />
                <NavItem to="/recipe" icon={<FileText size={24} />} label="Recipe" />
                <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
            </div>
        </nav>
    );
};

// NavItem Component
const NavItem = ({ to, icon, label }) => {
    return (
        <Link to={to} className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <div className="mb-1">{icon}</div>
            <span className="text-xs">{label}</span>
        </Link>
    );
};

// ✅ Adding PropTypes for validation
NavItem.propTypes = {
    to: PropTypes.string.isRequired,  // 'to' should be a required string
    icon: PropTypes.node.isRequired,  // 'icon' should be a React node (JSX)
    label: PropTypes.string.isRequired // 'label' should be a required string
};

export default MobileNavigation;
