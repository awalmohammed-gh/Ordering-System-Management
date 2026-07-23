import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useODMContext } from "../context/ODMContextProvider";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { makeOrder } from "../api/frontApis";
import Loading from "../ui/Loading";
import Toast from "../ui/Toast";

const CheckoutPage = () => {
  const { cartItems, grandTotal } = useODMContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);

  const isValid = name.trim().length > 0;

  const handleContinueToPayment = async () => {
    if (!isValid) return;

    try {
      setIsLoading(true);

      // Create order first
      const orderData = {
        orderName: name,
        notes,
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        total: grandTotal,
        status: "pending",
        paymentStatus: "unpaid",
      };

      const { data } = await makeOrder(orderData);

      if (data.success) {
        // Navigate to payment page with order data
        navigate("/payment", {
          state: {
            ...orderData,
            orderId: data.orderId || `ORD-${Date.now().toString().slice(-6)}`,
          },
        });
      } else {
        setToast({
          message: data.message || "Failed to create order",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setToast({
        message: "Error, something went wrong",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sectionLabel =
    "text-[11px] font-semibold uppercase tracking-widest text-[#6B7280] mb-2.5";

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#D97706]/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-[#D97706]" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-2">
            Your cart is empty
          </h2>
          <p className="text-[#6B7280] mb-6">
            Add something from the menu to get started.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#D97706] hover:bg-[#78350F] text-white font-semibold px-8 py-3 rounded-2xl transition-colors duration-200"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isLoading && <Loading />}

      <div className="min-h-screen bg-[#FFFBF5] pb-32 sm:pb-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-20 shadow-[0_4px_16px_-4px_rgba(31,41,55,0.08)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
              Checkout
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} —
              Confirm your order details
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Order Name */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)] space-y-4">
            <h2 className={sectionLabel}>Order Name</h2>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full px-4 py-3 bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/15 focus:border-[#D97706]/40 text-[#111827] placeholder-[#6B7280] transition-all text-sm"
              />
              <p className="text-xs text-[#6B7280] mt-1.5">
                We'll call this name when your order is ready
              </p>
            </div>
          </div>

          {/* Notes (optional) */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)] space-y-4">
            <h2 className={sectionLabel}>Notes (optional)</h2>
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests..."
                rows={2}
                className="w-full px-4 py-3 bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/15 focus:border-[#D97706]/40 text-[#111827] placeholder-[#6B7280] transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)]">
            <h2 className={sectionLabel}>Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 py-2 border-b border-[#E5E7EB] last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-bold flex items-center justify-center tabular-nums">
                      {item.quantity}
                    </span>
                    <span className="text-sm font-medium text-[#1F2937] truncate">
                      {item.product.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#78350F] tabular-nums shrink-0">
                    {formatPrice(
                      (item.product.finalPrice || item.product.price) *
                        item.quantity,
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)]">
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-[#1F2937]">Total</span>
              <span className="text-[#78350F] tabular-nums">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          {/* Continue to Payment Button */}
          <button
            onClick={handleContinueToPayment}
            disabled={!isValid || isLoading}
            className={`
              w-full bg-[#D97706] text-white py-3.5 rounded-2xl font-semibold
              transition-all duration-200 active:scale-95
              ${
                !isValid || isLoading
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#78350F] shadow-[0_10px_20px_-8px_rgba(217,119,6,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(120,53,15,0.45)]"
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />
                Creating Order...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight size={18} className="inline-block ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
