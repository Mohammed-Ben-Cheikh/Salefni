import { RouterProvider } from "router-kit";
import router from "./router";

const App = () => {
  return <RouterProvider routes={router} />;
};
export default App;
