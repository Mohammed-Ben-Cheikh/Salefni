import { createRouter } from "router-kit";
import AdminPage from "../pages/Admin";
import ApplicationPage from "../pages/Application";
import AdminLoginPage from "../pages/Auth/AdminLogin";
import About from "../pages/Main/About";
import Contact from "../pages/Main/Contact";
import Home from "../pages/Main/Home";
import SimulationPage from "../pages/Simulation";

const router = createRouter([
  {
    path: ["/", "/home"],
    component: <Home />,
  },
  {
    path: "/simulation",
    component: <SimulationPage />,
  },
  {
    path: "/application",
    component: <ApplicationPage />,
  },
  {
    path: "/about",
    component: <About />,
  },
  {
    path: "/contact",
    component: <Contact />,
  },
  {
    path: "/admin/login",
    component: <AdminLoginPage />,
  },
  {
    path: "/admin",
    component: <AdminPage />,
  },
]);
export default router;
