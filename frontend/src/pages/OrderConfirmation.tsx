import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ShoppingBag,
  PartyPopper,
  Banknote,
  CreditCard,
  Smartphone,
} from "lucide-react";

interface ConfirmationState {
  orderName: string;
  notes: string;
  items: Array<{
    productId: string;
    quantity: number;
    productName?: string;
    price?: number;
  }>;
  total: number;
  paymentMethod: "cashier" | "paystack";
  paymentStatus: "paid" | "unpaid";
  orderId: string;
  status?: string;
  createdAt?: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ConfirmationState | null;

  // Early return if no state
  if (!state || !state.items) {
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

  // Calculate total items safely
  const totalItems = state.items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  const estimatedSeconds = Math.min(60 + totalItems * 60, 600);

  const [secondsLeft, setSecondsLeft] = useState(estimatedSeconds);
  const isReady = secondsLeft <= 0;

  useEffect(() => {
    if (isReady) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isReady]);

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

  const progress = ((estimatedSeconds - secondsLeft) / estimatedSeconds) * 100;

  const {
    orderName,
    notes,
    items,
    total,
    paymentMethod,
    paymentStatus,
    orderId,
  } = state;

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cashier":
        return "Pay at Cashier";
      case "paystack":
        return "Paystack";
      default:
        return method;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "cashier":
        return <Banknote className="w-4 h-4 text-[#D97706]" />;
      case "paystack":
        return <CreditCard className="w-4 h-4 text-[#D97706]" />;
      default:
        return <Smartphone className="w-4 h-4 text-[#D97706]" />;
    }
  };

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
              ? `${orderName}, please come pick it up`
              : `Thanks, ${orderName} — we're on it`}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">Order #{orderId}</p>
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
              We'll call "{orderName}" — see you at the counter
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
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Order details */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] overflow-hidden">
          <div className="p-5 space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 py-1.5 border-b border-[#E5E7EB] last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-bold flex items-center justify-center tabular-nums">
                    {item.quantity}
                  </span>
                  <span className="text-sm font-medium text-[#1F2937] truncate">
                    {item.productName ||
                      `Product ${item.productId.slice(0, 6)}`}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#78350F] tabular-nums shrink-0">
                  {formatPrice((item.price || 0) * item.quantity)}
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
                {formatPrice(total || 0)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center gap-3 px-5 py-4 bg-[#FFFBF5] border-t border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/10 flex items-center justify-center shrink-0">
              {getPaymentIcon(paymentMethod)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1F2937]">
                {getPaymentMethodLabel(paymentMethod)}
              </p>
              {paymentMethod === "cashier" && (
                <p className="text-xs text-[#6B7280]">
                  Pay at the counter when you pick up
                </p>
              )}
              {paymentMethod === "paystack" && (
                <p className="text-xs text-[#6B7280]">
                  Payment completed via Paystack
                </p>
              )}
            </div>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  paymentStatus === "paid"
                    ? "bg-green-50 text-green-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {paymentStatus === "paid" ? "Paid" : "Pending Payment"}
              </span>
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
