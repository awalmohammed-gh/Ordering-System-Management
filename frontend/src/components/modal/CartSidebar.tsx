import { useODMContext } from "../../context/ODMContextProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import type { CartItems } from "../../type";
import { useNavigate } from "react-router-dom";

interface CartSidebarProps {
  isFixed?: boolean;
}

const CartSidebar = ({ isFixed = false }: CartSidebarProps) => {
  const { cartItems, removeFromCart, updateQuantity, grandTotal } =
    useODMContext();

  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);

  const getCustomizationSummary = (item: CartItems) => {
    const customization = item.product.customization;

    if (!customization) return null;

    const parts: string[] = [];

    if (customization.size) parts.push(customization.size.name);

    if (customization.temperature) parts.push(customization.temperature.name);

    if (customization.milk) parts.push(customization.milk.name);

    if (customization.syrups?.length)
      parts.push(customization.syrups.map((s) => s.name).join(", "));

    if (customization.extras?.length)
      parts.push(customization.extras.map((e) => e.name).join(", "));

    return parts.join(" • ");
  };

  const handleCheckout = () => {
    navigate("/checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fixed sidebar (always visible on desktop)
  if (isFixed) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] h-full max-h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E5E7EB] bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">
              Your Order
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-3">
                <ShoppingBag
                  className="w-7 h-7 text-[#D97706]"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-[#1F2937] font-medium">Your cart is empty</p>
              <p className="text-[#6B7280] text-xs mt-1">
                Add items from the menu
              </p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-[#FFFBF5] rounded-xl p-3 border border-[#E5E7EB]"
              >
                <div className="flex gap-3">
                  {item?.product?.image && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#FFFBF5]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1F2937] text-sm truncate">
                      {item.product.name}
                    </h3>

                    {getCustomizationSummary(item) && (
                      <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">
                        {getCustomizationSummary(item)}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[#78350F] font-bold text-sm tabular-nums">
                        {formatPrice(
                          item.product.finalPrice || item.product.price,
                        )}
                      </p>

                      <div className="flex items-center gap-2">
                        {item.quantity && (
                          <div className="flex items-center gap-1 bg-white rounded-full px-1">
                            <button
                              onClick={() =>
                                updateQuantity?.(
                                  item.product._id,
                                  item.quantity - 1,
                                )
                              }
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                              className="p-1 rounded-full hover:bg-[#FFF7ED] text-[#1F2937] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-medium w-5 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity?.(
                                  item.product._id,
                                  item.quantity + 1,
                                )
                              }
                              aria-label="Increase quantity"
                              className="p-1 rounded-full hover:bg-[#FFF7ED] text-[#1F2937] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          aria-label="Remove item"
                          className="p-1 rounded-full hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#E5E7EB] bg-white px-4 py-4 space-y-3 rounded-b-2xl">
            <div className="flex items-center justify-between font-bold">
              <span className="text-[#1F2937]">Total</span>
              <span className="text-[#78350F] tabular-nums">
                {formatPrice(grandTotal)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#D97706] text-white py-3 rounded-xl font-semibold shadow-[0_10px_20px_-8px_rgba(217,119,6,0.5)] hover:bg-[#78350F] hover:shadow-[0_12px_24px_-8px_rgba(120,53,15,0.45)] transition-all duration-200 active:scale-95 text-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    );
  }

  // Sliding sidebar content (for mobile)
  return (
    <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3 custom-scrollbar">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-4">
            <ShoppingBag className="w-9 h-9 text-[#D97706]" strokeWidth={1.5} />
          </div>
          <p className="text-[#1F2937] font-medium text-lg">
            Your cart is empty
          </p>
          <p className="text-[#6B7280] text-sm mt-1">
            Add something from the menu to get started
          </p>
        </div>
      ) : (
        cartItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-3.5 border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)]"
          >
            <div className="flex gap-3">
              {item.product.image?.[0] && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#FFFBF5]">
                  <img
                    src={item.product.image[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1F2937] truncate">
                  {item.product.name}
                </h3>

                {getCustomizationSummary(item) && (
                  <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">
                    {getCustomizationSummary(item)}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2">
                  <p className="text-[#78350F] font-bold tabular-nums">
                    {formatPrice(item.product.finalPrice || item.product.price)}
                  </p>

                  <div className="flex items-center gap-2">
                    {item.quantity && (
                      <div className="flex items-center gap-1 bg-[#FFFBF5] rounded-full px-1">
                        <button
                          onClick={() =>
                            updateQuantity?.(item.product._id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-full hover:bg-white text-[#1F2937] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-5 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity?.(item.product._id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="p-1 rounded-full hover:bg-white text-[#1F2937] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      aria-label="Remove item"
                      className="p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Footer for mobile sliding cart */}
      {cartItems.length > 0 && (
        <div className="border-t border-[#E5E7EB] bg-white -mx-5 sm:-mx-6 px-5 sm:px-6 py-4 sm:py-5 space-y-3 sticky bottom-0">
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-[#1F2937]">Total</span>
            <span className="text-[#78350F] tabular-nums">
              {formatPrice(grandTotal)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-[#D97706] text-white py-3.5 rounded-2xl font-semibold shadow-[0_10px_20px_-8px_rgba(217,119,6,0.5)] hover:bg-[#78350F] hover:shadow-[0_12px_24px_-8px_rgba(120,53,15,0.45)] transition-all duration-200 active:scale-95"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
