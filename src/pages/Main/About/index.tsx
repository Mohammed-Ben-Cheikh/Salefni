import { useParams } from "router-kit";
import MainLayout from "../../../components/common/Layout/main";
const About = () => {
  const { id } = useParams();
  return <MainLayout>holalala from About{id}</MainLayout>;
};
export default About;
