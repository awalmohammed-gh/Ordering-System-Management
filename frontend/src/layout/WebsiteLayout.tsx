import { Outlet } from "react-router-dom"
import CustomizationModal from "../components/modal/CustomizationModal"
// import CartSidebar from "../components/modal/CartSidebar"

const WebsiteLayout = () => {
  return (
    <div>
      <Outlet/>
      <CustomizationModal/>
      {/* <CartSidebar/> */}
    </div>
  )
}

export default WebsiteLayout
