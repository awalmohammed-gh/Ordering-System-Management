import { Route, createBrowserRouter,createRoutesFromElements } from "react-router-dom";
import WebsiteLayout from "../layout/WebsiteLayout";
import WelcomePage from "../pages/WelcomePage";
import MenuPage from "../pages/MenuPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderConfirmation from "../pages/OrderConfirmation";
import KitchenLayout from "../layout/KitchenLayout";
import KitchenDisplay from "../pages/kitchen_display/kitchen_page/KitchenDisplay";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import AddProduct from "../pages/Admin/AddProduct";
import ListProduct from "../pages/Admin/ListProduct";
import Revenue from "../pages/Admin/Revenue";
import Orders from "../pages/Admin/Orders";
import CashierLayout from "../layout/CashierLayout";
import CheckOrders from "../pages/Cashier/CheckOrders";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
      </Route>

      <Route path="/kitchen" element={<KitchenLayout />}>
        <Route index element={<KitchenDisplay />} />
      </Route>

      {/* admin login  */}
      <Route path="admin-login" element={<AdminLogin />} />

      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="products" element={<ListProduct />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="orders" element={<Orders />} />
      </Route>

      <Route path="/cashier" element={<CashierLayout/>}>
        <Route index element={<CheckOrders/>}/>
      </Route>
    </>,
  ),
);