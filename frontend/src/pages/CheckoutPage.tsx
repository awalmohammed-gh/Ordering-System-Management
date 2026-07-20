import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useODMContext } from "../context/ODMContextProvider";
import { ShoppingBag, Smartphone } from "lucide-react";

const CheckoutPage = () => {
  const { cartItems, grandTotal} = useODMContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [momoNumber, setMomoNumber] = useState("");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);

  const isValid = name.trim().length > 0 && momoNumber.trim().length > 0;

  const handleConfirmOrder = () => {
    // Send order + payment request to counter/kitchen — no submission handler exists in context yet
    const orderData = {
      name,
      notes,
      cartItems,
      grandTotal,
      paymentMethod: "momo" as const,
      momoNumber,
    };
    console.log("Confirm order", orderData);
    navigate("/order-confirmation", { state: orderData });
  
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
    <div className="min-h-screen bg-[#FFFBF5] pb-32 sm:pb-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-20 shadow-[0_4px_16px_-4px_rgba(31,41,55,0.08)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
            Confirm Your Order
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} —
            we'll get this ready for you
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
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

        {/* Name for order */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)] space-y-4">
          <h2 className={sectionLabel}>Name for Your Order</h2>
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
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests..."
              rows={2}
              className="w-full px-4 py-3 bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/15 focus:border-[#D97706]/40 text-[#111827] placeholder-[#6B7280] transition-all text-sm resize-none"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)] space-y-4">
          <h2 className={sectionLabel}>Payment Method</h2>

          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-[#D97706] bg-[#FFF7ED]">
            <div className="w-10 h-10 rounded-xl bg-[#D97706] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#78350F]">
                Mobile Money (MoMo)
              </p>
              <p className="text-xs text-[#6B7280]">
                Only payment method available right now
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">
              MoMo Number
            </label>
            <input
              type="tel"
              value={momoNumber}
              onChange={(e) => setMomoNumber(e.target.value)}
              placeholder="e.g. 024 123 4567"
              className="w-full px-4 py-3 bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/15 focus:border-[#D97706]/40 text-[#111827] placeholder-[#6B7280] transition-all text-sm"
            />
            <p className="text-xs text-[#6B7280] mt-1.5">
              We'll send a payment prompt to this number
            </p>
          </div>
        </div>

        {/* Total - desktop, inline */}
        <div className="hidden sm:block bg-white rounded-3xl border border-[#E5E7EB] p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)] space-y-2.5">
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-[#1F2937]">Total</span>
            <span className="text-[#78350F] tabular-nums">
              {formatPrice(grandTotal)}
            </span>
          </div>
          <button
            onClick={handleConfirmOrder}
            disabled={!isValid}
            className="w-full mt-2 bg-[#D97706] text-white py-3.5 rounded-2xl font-semibold shadow-[0_10px_20px_-8px_rgba(217,119,6,0.5)] hover:bg-[#78350F] hover:shadow-[0_12px_24px_-8px_rgba(120,53,15,0.45)] transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            Confirm & Pay with MoMo
          </button>
        </div>
      </div>

      {/* Sticky bottom bar - mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3.5 shadow-[0_-8px_24px_-8px_rgba(31,41,55,0.15)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#6B7280]">Total</span>
          <span className="text-lg font-bold text-[#78350F] tabular-nums">
            {formatPrice(grandTotal)}
          </span>
        </div>
        <button
          onClick={handleConfirmOrder}
          disabled={!isValid}
          className="w-full bg-[#D97706] text-white py-3.5 rounded-2xl font-semibold shadow-[0_10px_20px_-8px_rgba(217,119,6,0.5)] active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
        >
          Confirm & Pay with MoMo
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
