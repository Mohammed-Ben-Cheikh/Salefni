import { useParams } from "router-kit";
import MainLayout from "../../../components/common/Layout/main";
const Contact = () => {
  const { id } = useParams();
  return <MainLayout>holalala from Contact{id}</MainLayout>;
};
export default Contact;
