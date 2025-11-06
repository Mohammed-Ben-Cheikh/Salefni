import { useParams } from "router-kit";
import MainLayout from "../../../components/common/Layout/main";
const Home = () => {
  const { id } = useParams();
  return <MainLayout>holalala from home{id}</MainLayout>;
};
export default Home;
