import { useODMContext } from "../../context/ODMContextProvider";
import { ShoppingBagIcon } from "lucide-react";

const CartButton = () => {
  const { cartItems, setIsCartOpen } = useODMContext();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      className="relative p-2.5 rounded-xl bg-[#FFFBF5] border border-[#E5E7EB] text-[#1F2937] hover:border-[#D97706]/40 hover:text-[#D97706] transition-all duration-200"
    >
      <ShoppingBagIcon className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-[#D97706] text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-[0_2px_6px_-1px_rgba(217,119,6,0.6)]">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
