import { createRouter } from "router-kit";
import Contact from "../pages/Contact";
import Home from "../pages/Home";

const router = createRouter([
  {
    path: "/:id",
    component: <Home />,
  },
  {
    path: "/contact",
    component: <Contact />,
  },
]);
export default router;
