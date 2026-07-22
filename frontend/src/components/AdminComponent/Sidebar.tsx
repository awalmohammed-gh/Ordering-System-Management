import {
  LayoutDashboard,
  PlusCircle,
  List,
  ShoppingBag,
  LogOut,
  Settings,
  Banknote,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { adminLogout } from "../../api/frontApis";
import Toast from "../../ui/Toast";
import Loading from "../../ui/Loading";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);
   const [toast, setToast] = useState<{
     message: string;
     type: "success" | "error" | "info";
   } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "add-product",
      label: "Add Product",
      icon: PlusCircle,
      path: "/admin/dashboard/add-product",
    },
    {
      id: "list-products",
      label: "List Products",
      icon: List,
      path: "/admin/dashboard/products",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      path: "/admin/dashboard/orders",
      badge: 12, // Example: pending orders count
    },
    {
      id: "revenue",
      label: "Revenue",
      icon: Banknote,
      path: "/admin/dashboard/revenue",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async() =>{
    try {
       setLoading(true);
       const {data} = await adminLogout();
       if(data.success){
       
         setToast(
         { message:"logout successfully",
          type:"success"}
         )
          navigate("/admin-login");
       }else{
         setToast({
          message:"Error, Something went wrong",
          type:"error"
         })
       }
    } catch (error) {
      console.error(error);
      setToast({
        message: "Error, Something went wrong",
        type: "error",
      });
    }
  }

  if(loading){
    return <Loading/>
  }



  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-[#D97706] text-white rounded-xl shadow-lg hover:bg-[#78350F] transition-colors duration-200"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen bg-[#FFFBF5] border-r border-[#E5E7EB] z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "w-[280px]" : "w-[260px]"}
          flex flex-col
        `}
      >
        {/* Close button for mobile */}
        {isMobile && isOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#E5E7EB] transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-[#1F2937]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Logo/Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E5E7EB] bg-white">
          <div className="w-10 h-10 rounded-xl bg-[#D97706] flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1F2937] tracking-tight">
              Admin Panel
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group relative
                  ${
                    active
                      ? "bg-[#D97706] text-white shadow-[0_4px_12px_rgba(217,119,6,0.3)]"
                      : "text-[#6B7280] hover:bg-[#FFF7ED] hover:text-[#1F2937]"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`
                    transition-colors duration-200
                    ${active ? "text-white" : "text-[#6B7280] group-hover:text-[#D97706]"}
                  `}
                />
                <span className="text-sm font-medium flex-1 text-left">
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`
                      text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-[#D97706]/10 text-[#D97706]"
                      }
                    `}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-[#E5E7EB] p-4 space-y-2 bg-white/50">
          <button
            onClick={() => navigate("/admin/settings")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B7280] hover:bg-[#FFF7ED] hover:text-[#1F2937] transition-all duration-200 group"
          >
            <Settings
              size={20}
              className="text-[#6B7280] group-hover:text-[#D97706] transition-colors duration-200"
            />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button
            onClick={() => {
              // Handle logout
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="text-[#6B7280] group-hover:text-red-600 transition-colors duration-200"
            />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div >
          {
    toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )
  }
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D97706;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #78350F;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
