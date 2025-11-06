import { NavLink } from "router-kit";

const MainHeader = () => {
  const linkClasses =
    "px-4 py-2 text-gray-600 hover:text-yellow-600 transition-colors duration-200 rounded-md hover:bg-gray-100";
  const activeLinkClasses = "text-yellow-600 bg-gray-100";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex justify-center max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-4">
            <NavLink
              className={linkClasses}
              activeClassName={activeLinkClasses}
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className={linkClasses}
              activeClassName={activeLinkClasses}
              to="/about"
            >
              About
            </NavLink>
            <NavLink
              className={linkClasses}
              activeClassName={activeLinkClasses}
              to="/contact"
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainHeader;
