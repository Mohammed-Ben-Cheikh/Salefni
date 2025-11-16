import { Bell, Calculator, LogOut, User } from "lucide-react";
import { NavLink } from "router-kit";
import { useAppStore } from "../../../store";
import Button from "../../ui/Button";

const MainHeader = () => {
  const { user, isAuthenticated, logout, unreadCount } = useAppStore();

  const linkClasses =
    "px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-md hover:bg-gray-100";
  const activeLinkClasses = "text-blue-600 bg-blue-50";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-blue-600">Salefni</h1>
          </div>

          {/* Navigation principale */}
          <div className="flex space-x-4">
            <NavLink
              className={linkClasses}
              activeClassName={activeLinkClasses}
              to="/"
            >
              Accueil
            </NavLink>
            <NavLink
              className={linkClasses}
              activeClassName={activeLinkClasses}
              to="/simulation"
            >
              Simulateur
            </NavLink>
            <NavLink
              className={linkClasses}
              activeClassName={activeLinkClasses}
              to="/about"
            >
              À propos
            </NavLink>
            <NavLink
              className={linkClasses}
              activeClassName={activeLinkClasses}
              to="/contact"
            >
              Contact
            </NavLink>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user?.role === "admin" && (
              <>
                <NavLink
                  className={linkClasses}
                  activeClassName={activeLinkClasses}
                  to="/admin"
                >
                  Administration
                </NavLink>

                {/* Notifications */}
                <div className="relative">
                  <Button variant="outline" size="sm" className="p-2">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Profil utilisateur */}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>

                {/* Déconnexion */}
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <NavLink
                className={linkClasses}
                activeClassName={activeLinkClasses}
                to="/admin/login"
              >
                <User className="h-4 w-4 mr-2 inline" />
                Connexion Admin
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainHeader;
