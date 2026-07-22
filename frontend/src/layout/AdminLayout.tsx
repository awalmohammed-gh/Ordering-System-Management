import { Outlet } from "react-router-dom";
import Sidebar from "../components/AdminComponent/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#FFFBF5]">
      <div className="w-80">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-6">
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
