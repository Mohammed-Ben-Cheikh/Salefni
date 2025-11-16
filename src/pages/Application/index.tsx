import MainLayout from "../../components/common/Layout/main";
import CreditApplicationForm from "../../components/features/CreditApplication";

const ApplicationPage = () => {
  return (
    <MainLayout>
      <div className="py-8">
        <CreditApplicationForm />
      </div>
    </MainLayout>
  );
};

export default ApplicationPage;
