import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useODMContext } from "../context/ODMContextProvider";
import {
  Banknote,
  CreditCard,
  Check,
  ArrowLeft,
  Lock,
} from "lucide-react";
import Loading from "../ui/Loading";
import Toast from "../ui/Toast";
import { makeOrder} from "../api/frontApis";

const PaymentPage = () => {
  const { clearCart } = useODMContext();
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;

  const [paymentMethod, setPaymentMethod] = useState<"cashier" | "paystack">(
    "cashier",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);

  // Redirect if no order data
  if (!orderData) {
    navigate("/checkout");
    return null;
  }

  const handlePayment = async () => {
     try {
         setIsProcessing(true);

         // Update order with payment method
         const paymentData = {
           orderId: orderData.orderId,
           paymentMethod,
           paymentStatus: paymentMethod === "cashier" ? "unpaid" : "paid",
           status: paymentMethod === "cashier" ? "pending" : "processing",
         };

         if (paymentMethod === "cashier") {
           const { data } = await makeOrder(paymentData);
           if (data.success) {
             setToast({
               message: data.message || "Payment processed successfully",
               type: "success",
             });

             // Clear cart
             clearCart();
             navigate("/order-confirmation");
           }
         }
     } catch (error) {
        console.error(error);
     }
  };

  if (isProcessing) {
    return <Loading />;
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

      <div className="min-h-screen bg-[#FFFBF5] pb-32 sm:pb-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-20 shadow-[0_4px_16px_-4px_rgba(31,41,55,0.08)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/checkout")}
                className="p-2 rounded-full hover:bg-[#FFF7ED] transition-colors"
              >
                <ArrowLeft size={20} className="text-[#6B7280]" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
                  Payment
                </h1>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  Order #{orderData.orderId} · {orderData.orderName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)]">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#6B7280] mb-2.5">
              Order Summary
            </h2>
            <div className="space-y-3">
              {orderData.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 py-2 border-b border-[#E5E7EB] last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-bold flex items-center justify-center tabular-nums">
                      {item.quantity}
                    </span>
                    <span className="text-sm font-medium text-[#1F2937] truncate">
                      {item.productName || "Product"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#78350F] tabular-nums shrink-0">
                    {formatPrice(item.price * item.quantity || 0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Notes */}
            {orderData.notes && (
              <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] italic">
                  "{orderData.notes}"
                </p>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between text-lg font-bold pt-3 mt-3 border-t border-[#E5E7EB]">
              <span className="text-[#1F2937]">Total</span>
              <span className="text-[#78350F] tabular-nums">
                {formatPrice(orderData.total)}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_1px_2px_rgba(31,41,55,0.06)] space-y-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#6B7280] mb-2.5">
              Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Pay at Cashier Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cashier")}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-200
                  ${
                    paymentMethod === "cashier"
                      ? "border-[#D97706] bg-[#FFF7ED]"
                      : "border-[#E5E7EB] bg-white hover:border-[#D97706]/40"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === "cashier"
                      ? "bg-[#D97706]"
                      : "bg-[#E5E7EB]"
                  }`}
                >
                  <Banknote
                    className={`w-5 h-5 ${
                      paymentMethod === "cashier"
                        ? "text-white"
                        : "text-[#6B7280]"
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={`text-sm font-semibold ${
                      paymentMethod === "cashier"
                        ? "text-[#78350F]"
                        : "text-[#1F2937]"
                    }`}
                  >
                    Pay at Cashier
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Pay in person at the counter
                  </p>
                </div>
                {paymentMethod === "cashier" && (
                  <div className="w-6 h-6 rounded-full bg-[#D97706] flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>

              {/* Pay with Paystack Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("paystack")}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-200
                  ${
                    paymentMethod === "paystack"
                      ? "border-[#D97706] bg-[#FFF7ED]"
                      : "border-[#E5E7EB] bg-white hover:border-[#D97706]/40"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === "paystack"
                      ? "bg-[#D97706]"
                      : "bg-[#E5E7EB]"
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 ${
                      paymentMethod === "paystack"
                        ? "text-white"
                        : "text-[#6B7280]"
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={`text-sm font-semibold ${
                      paymentMethod === "paystack"
                        ? "text-[#78350F]"
                        : "text-[#1F2937]"
                    }`}
                  >
                    Pay with Paystack
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Card, Mobile Money, Bank Transfer
                  </p>
                </div>
                {paymentMethod === "paystack" && (
                  <div className="w-6 h-6 rounded-full bg-[#D97706] flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            </div>

            {/* Payment Info Messages */}
            {paymentMethod === "cashier" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs text-blue-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  You'll pay at the counter when you pick up your order
                </p>
              </div>
            )}

            {paymentMethod === "paystack" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-xs text-green-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  You'll be redirected to Paystack to complete payment securely
                </p>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Lock size={14} />
            <span>Your payment is secure and encrypted</span>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`
              w-full bg-[#D97706] text-white py-3.5 rounded-2xl font-semibold
              transition-all duration-200 active:scale-95
              ${
                isProcessing
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#78350F] shadow-[0_10px_20px_-8px_rgba(217,119,6,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(120,53,15,0.45)]"
              }
            `}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />
                Processing...
              </>
            ) : (
              `Place Order · ${formatPrice(orderData.total)}`
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
