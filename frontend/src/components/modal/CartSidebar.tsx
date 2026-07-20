import { useODMContext } from "../../context/ODMContextProvider";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import type { CartItems } from "../../type";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CartSidebar = () => {
  const {
    cartItems,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    grandTotal,
  } = useODMContext();

  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(isCartOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [prevIsCartOpen, setPrevIsCartOpen] = useState(isCartOpen);

  if (isCartOpen !== prevIsCartOpen) {
    setPrevIsCartOpen(isCartOpen);
    if (isCartOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
    }
  }

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match this with animation duration
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleClose = () => {
    setIsCartOpen(false);
  };

  if (!shouldRender) {
    return null;
  }

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
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:max-w-md bg-[#FFFBF5] z-50 shadow-[0_24px_48px_-12px_rgba(31,41,55,0.35)] flex flex-col transition-transform duration-300 ease-in-out ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-[#E5E7EB] bg-white">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
              Your Order
            </h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="p-2 rounded-full hover:bg-[#FFF7ED] text-[#1F2937] transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-4">
                <ShoppingBag
                  className="w-9 h-9 text-[#D97706]"
                  strokeWidth={1.5}
                />
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
                        {formatPrice(
                          item.product.finalPrice || item.product.price,
                        )}
                      </p>

                      <div className="flex items-center gap-2">
                        {item.quantity && (
                          <div className="flex items-center gap-1 bg-[#FFFBF5] rounded-full px-1">
                            <button
                              onClick={() =>
                                updateQuantity?.(
                                  item.product.id,
                                  item.quantity - 1,
                                )
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
                                updateQuantity?.(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              aria-label="Increase quantity"
                              className="p-1 rounded-full hover:bg-white text-[#1F2937] transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => removeFromCart(item.product.id)}
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
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#E5E7EB] bg-white px-5 sm:px-6 py-4 sm:py-5 space-y-3">
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
    </>
  );
};

export default CartSidebar;
