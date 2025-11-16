import AdminDashboard from "../../components/features/Admin/Dashboard";
import { useAppStore } from "../../store";

const AdminPage = () => {
  const { isAuthenticated, user } = useAppStore();

  if (!isAuthenticated || user?.role !== "admin") {
    window.location.href = "/admin/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
