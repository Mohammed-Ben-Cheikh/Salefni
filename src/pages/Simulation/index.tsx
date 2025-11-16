import MainLayout from "../../components/common/Layout/main";
import CreditSimulator from "../../components/features/CreditSimulator";

const SimulationPage = () => {
  return (
    <MainLayout>
      <div className="py-8">
        <CreditSimulator />
      </div>
    </MainLayout>
  );
};

export default SimulationPage;
