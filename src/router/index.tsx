import { createRouter } from "router-kit";
import About from "../pages/Main/About";
import Contact from "../pages/Main/Contact";
import Home from "../pages/Main/Home";

const router = createRouter([
  {
    path: ["/:step", "/home/:step"],
    component: <Home />,
  },
  {
    path: "/about",
    component: <About />,
  },
  {
    path: "/contact",
    component: <Contact />,
  },
]);
export default router;
