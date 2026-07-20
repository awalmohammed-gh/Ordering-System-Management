import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ShoppingBag,
  Smartphone,
  PartyPopper,
} from "lucide-react";

interface ConfirmationState {
  name: string;
  notes: string;
  cartItems: Array<{
    quantity: number;
    product: { name: string; price: number; finalPrice?: number };
  }>;
  grandTotal: number;
  paymentMethod: "momo";
  momoNumber: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ConfirmationState | null;

  // Estimated wait — simulated only, not a real kitchen/prep status
  const totalItems = state
    ? state.cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const estimatedSeconds = Math.min(60 + totalItems * 60, 600); 

  const [secondsLeft, setSecondsLeft] = useState(estimatedSeconds);
  const isReady = secondsLeft <= 0;

  useEffect(() => {
    if (!state || isReady) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [state, isReady]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = state
    ? ((estimatedSeconds - secondsLeft) / estimatedSeconds) * 100
    : 0;

  if (!state) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#D97706]/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-[#D97706]" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-2">
            No order found
          </h2>
          <p className="text-[#6B7280] mb-6">
            We couldn't find a recent order to show you.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#D97706] hover:bg-[#78350F] text-white font-semibold px-8 py-3 rounded-2xl transition-colors duration-200"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const { name, notes, cartItems, grandTotal, momoNumber } = state;

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-lg w-full">
        {/* Status header — changes once timer hits zero */}
        <div className="text-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500 ${
              isReady ? "bg-[#16A34A]/10" : "bg-[#D97706]/10"
            }`}
          >
            {isReady ? (
              <PartyPopper
                className="w-10 h-10 text-[#16A34A]"
                strokeWidth={1.5}
              />
            ) : (
              <CheckCircle2
                className="w-10 h-10 text-[#16A34A]"
                strokeWidth={1.5}
              />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] tracking-tight">
            {isReady ? "Your Order is Ready!" : "Order Confirmed"}
          </h1>
          <p className="text-[#6B7280] mt-1.5">
            {isReady
              ? `${name}, please come pick it up`
              : `Thanks, ${name} — payment received, we're on it`}
          </p>
        </div>

        {/* Countdown card */}
        <div
          className={`rounded-3xl border p-5 sm:p-6 mb-4 text-center transition-colors duration-500 ${
            isReady
              ? "bg-[#16A34A]/5 border-[#16A34A]/30"
              : "bg-white border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)]"
          }`}
        >
          {isReady ? (
            <p className="text-[#16A34A] font-semibold text-lg">
              We'll call "{name}" — see you at the counter
            </p>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 text-[#6B7280] text-sm mb-2">
                <Clock size={16} />
                <span>Estimated time remaining</span>
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-[#78350F] tabular-nums tracking-tight">
                {formatTime(secondsLeft)}
              </p>
              <div className="w-full h-2 bg-[#FFFBF5] rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-[#D97706] rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Order details */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] overflow-hidden">
          <div className="p-5 space-y-3">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 py-1.5 border-b border-[#E5E7EB] last:border-b-0"
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

            {notes && (
              <div className="pt-2">
                <p className="text-xs text-[#6B7280] italic">"{notes}"</p>
              </div>
            )}

            <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-[#E5E7EB]">
              <span className="text-[#1F2937]">Total</span>
              <span className="text-[#78350F] tabular-nums">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4 bg-[#FFFBF5] border-t border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-[#D97706]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1F2937]">Mobile Money</p>
              <p className="text-xs text-[#6B7280]">
                Payment prompt sent to {momoNumber}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/menu")}
          className="w-full mt-5 border-2 border-[#E5E7EB] text-[#6B7280] font-medium py-3.5 rounded-2xl hover:bg-[#FFF7ED] hover:border-[#D97706]/40 hover:text-[#78350F] transition-all duration-200"
        >
          Order Something Else
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
