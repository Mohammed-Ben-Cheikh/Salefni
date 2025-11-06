import type { ReactNode } from "react";
import { NavLink } from "router-kit";

const Dashboard = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <nav>
        <NavLink
          className="text-red-600"
          activeClassName="text-yellow-600"
          to="/"
        >
          go to Home
        </NavLink>
        <NavLink
          className="text-red-600"
          activeClassName="text-yellow-600"
          to="/contact"
        >
          go to Contact
        </NavLink>
      </nav>
      {children}
    </>
  );
};
export default Dashboard;
