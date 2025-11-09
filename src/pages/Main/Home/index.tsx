import { useDynamicComponents } from "router-kit";
import MainLayout from "../../../components/common/Layout/main";
const Home = () => {
  const component = useDynamicComponents(
    {
      step1: <h1>test from 1</h1>,
    },
    "step"
  );
  return <MainLayout>holalala from home {component}</MainLayout>;
};
export default Home;
