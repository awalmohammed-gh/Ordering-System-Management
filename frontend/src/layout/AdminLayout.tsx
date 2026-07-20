import { Outlet } from "react-router-dom";
import Sidebar from "../components/AdminComponent/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#FFFBF5]">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-65 p-4 sm:p-6 transition-all duration-300">
          <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
