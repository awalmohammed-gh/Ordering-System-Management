import { useEffect, useRef, useState } from "react";
import {
  Clock,
  User,
  ChefHat,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Bell,
  X,
} from "lucide-react";

type OrderStatus = "new" | "preparing" | "ready";

interface KitchenOrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

interface KitchenOrder {
  id: string;
  customerName: string;
  items: KitchenOrderItem[];
  status: OrderStatus;
  placedAt: number;
  paymentMethod: "momo";
}

// Mock data — stands in for real orders until this reads from a shared source
const initialOrders: KitchenOrder[] = [
  {
    id: "1",
    customerName: "Kwame",
    items: [
      { name: "Cappuccino", quantity: 2, notes: "Extra hot, oat milk" },
      { name: "Croissant", quantity: 1 },
    ],
    status: "new",
    placedAt: Date.now() - 2 * 60 * 1000,
    paymentMethod: "momo",
  },
  {
    id: "2",
    customerName: "Ama",
    items: [{ name: "Iced Latte", quantity: 1 }],
    status: "preparing",
    placedAt: Date.now() - 6 * 60 * 1000,
    paymentMethod: "momo",
  },
  {
    id: "3",
    customerName: "Yaw",
    items: [
      { name: "Espresso", quantity: 1 },
      { name: "Blueberry Muffin", quantity: 2 },
    ],
    status: "ready",
    placedAt: Date.now() - 11 * 60 * 1000,
    paymentMethod: "momo",
  },
];

// Additional mock orders that will arrive automatically
const pendingOrders: Omit<KitchenOrder, "id" | "placedAt">[] = [
  {
    customerName: "Abena",
    items: [{ name: "Flat White", quantity: 1, notes: "Oat milk" }],
    status: "new",
    paymentMethod: "momo",
  },
  {
    customerName: "Kojo",
    items: [{ name: "Americano", quantity: 2 }],
    status: "new",
    paymentMethod: "momo",
  },
  {
    customerName: "Efua",
    items: [
      { name: "Latte", quantity: 1 },
      { name: "Chocolate Croissant", quantity: 1 },
    ],
    status: "new",
    paymentMethod: "momo",
  },
  {
    customerName: "Kwabena",
    items: [{ name: "Mocha", quantity: 1, notes: "Extra shot" }],
    status: "new",
    paymentMethod: "momo",
  },
  {
    customerName: "Ama",
    items: [{ name: "Hot Chocolate", quantity: 1 }],
    status: "new",
    paymentMethod: "momo",
  },
];

const columns: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "new", label: "New Orders", icon: Clock },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready for Pickup", icon: CheckCircle2 },
];

let mockOrderCounter = 4; // Start after initial orders

const KitchenDisplay = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [toast, setToast] = useState<KitchenOrder | null>(null);
  const [isToastExiting, setIsToastExiting] = useState(false);
  const knownIds = useRef(new Set(initialOrders.map((o) => o.id)));
  const [animatedOrders, setAnimatedOrders] = useState<Set<string>>(new Set());
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationPulse, setIsNotificationPulse] = useState(false);
  const previousNewCount = useRef(0);
  const pendingOrdersIndex = useRef(0);
  const autoOrderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const newCount = orders.filter((o) => o.status === "new").length;

  // Auto-add new orders from pending list
  useEffect(() => {
    // Only start auto-adding if there are pending orders
    if (pendingOrdersIndex.current >= pendingOrders.length) {
      return;
    }

    // Add first order after 3 seconds, then every 5-8 seconds
    const addNextOrder = () => {
      if (pendingOrdersIndex.current < pendingOrders.length) {
        const pendingOrder = pendingOrders[pendingOrdersIndex.current];
        const newOrder: KitchenOrder = {
          id: String(mockOrderCounter++),
          ...pendingOrder,
          placedAt: Date.now(),
        };
        setOrders((prev) => [...prev, newOrder]);
        pendingOrdersIndex.current++;

        // Schedule next order after random delay
        if (pendingOrdersIndex.current < pendingOrders.length) {
          const delay = 5000 + Math.random() * 3000; // 5-8 seconds
          autoOrderTimer.current = setTimeout(addNextOrder, delay);
        }
      }
    };

    // Start with a 3-second delay
    const initialDelay = setTimeout(addNextOrder, 3000);

    return () => {
      clearTimeout(initialDelay);
      if (autoOrderTimer.current) {
        clearTimeout(autoOrderTimer.current);
      }
    };
  }, []);

  // Update notification count and trigger pulse animation
  useEffect(() => {
    if (newCount > previousNewCount.current) {
      setNotificationCount(newCount);
      setIsNotificationPulse(true);
      // Reset pulse animation after it completes
      setTimeout(() => setIsNotificationPulse(false), 600);
    } else {
      setNotificationCount(newCount);
    }
    previousNewCount.current = newCount;
  }, [newCount]);

  // Fires a toast only for orders whose id we haven't seen before
  useEffect(() => {
    const unseen = orders.find((o) => !knownIds.current.has(o.id));
    if (unseen) {
      knownIds.current.add(unseen.id);
      setToast(unseen);
      setIsToastExiting(false);
      // Auto-dismiss after 5 seconds with exit animation
      const dismissTimeout = setTimeout(() => {
        setIsToastExiting(true);
        const removeTimeout = setTimeout(() => setToast(null), 300);
        return () => clearTimeout(removeTimeout);
      }, 5000);
      return () => clearTimeout(dismissTimeout);
    }
  }, [orders]);

  // Animate newly added orders
  useEffect(() => {
    const newOrderIds = orders
      .filter((o) => !animatedOrders.has(o.id))
      .map((o) => o.id);
    if (newOrderIds.length > 0) {
      newOrderIds.forEach((id) => {
        setAnimatedOrders((prev) => new Set(prev).add(id));
      });
    }
  }, [orders, animatedOrders]);

  const advanceStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;
        const next: OrderStatus =
          order.status === "new"
            ? "preparing"
            : order.status === "preparing"
              ? "ready"
              : "ready";
        return { ...order, status: next };
      }),
    );
  };

  const completeOrder = (id: string) => {
    const orderElement = document.getElementById(`order-${id}`);
    if (orderElement) {
      orderElement.classList.add("animate-orderExit");
      setTimeout(() => {
        setOrders((prev) => prev.filter((order) => order.id !== id));
      }, 300);
    } else {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    }
  };

  const dismissToast = () => {
    setIsToastExiting(true);
    setTimeout(() => setToast(null), 300);
  };

  const [currentTime, setCurrentTime] = useState<number | null>(null);
  useEffect(() => {
    const initTimer = setTimeout(() => setCurrentTime(Date.now()), 0);
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, []);

  const minutesAgo = (timestamp: number) => {
    if (currentTime === null) return 0;
    return Math.max(0, Math.floor((currentTime - timestamp) / 60000));
  };

  const columnStyles: Record<
    OrderStatus,
    { header: string; icon: string; badge: string }
  > = {
    new: {
      header: "bg-[#D97706]/10 text-[#78350F]",
      icon: "text-[#D97706]",
      badge: "bg-[#D97706] text-white",
    },
    preparing: {
      header: "bg-[#1F2937]/5 text-[#1F2937]",
      icon: "text-[#1F2937]",
      badge: "bg-[#1F2937] text-white",
    },
    ready: {
      header: "bg-[#16A34A]/10 text-[#16A34A]",
      icon: "text-[#16A34A]",
      badge: "bg-[#16A34A] text-white",
    },
  };

  const actionLabel: Record<OrderStatus, string> = {
    new: "Start Preparing",
    preparing: "Mark Ready",
    ready: "Picked Up",
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Toast — transient, per new arrival */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
            isToastExiting
              ? "opacity-0 -translate-y-4 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          <div className="flex items-center gap-3 bg-[#1F2937] text-white pl-3 pr-4 py-3 rounded-2xl shadow-[0_16px_32px_-8px_rgba(31,41,55,0.5)] max-w-sm animate-toastIn">
            <div className="w-9 h-9 rounded-full bg-[#D97706] flex items-center justify-center shrink-0">
              <Bell size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                New order — {toast.customerName}
              </p>
              <p className="text-xs text-white/70 truncate">
                {toast.items.map((i) => i.name).join(", ")}
              </p>
            </div>
            <button
              onClick={dismissToast}
              aria-label="Dismiss notification"
              className="ml-1 p-1 rounded-full hover:bg-white/10 shrink-0 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] border-t-4 border-t-[#D97706] px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-[0_4px_16px_-4px_rgba(31,41,55,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
              Kitchen Display
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {orders.length} active {orders.length === 1 ? "order" : "orders"}
            </p>
          </div>

          {/* Notification Bell with Count */}
          <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-[#FFF7ED] transition-colors duration-200"
              aria-label="Notifications"
            >
              <Bell size={22} className="text-[#1F2937]" />
              {notificationCount > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#D97706] text-white text-[10px] font-bold rounded-full shadow-[0_2px_8px_rgba(217,119,6,0.4)] ${
                    isNotificationPulse ? "animate-notificationPulse" : ""
                  }`}
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Persistent banner — always reflects real waiting count */}
        {newCount > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-[#D97706]/10 text-[#78350F] text-sm font-medium px-4 py-2.5 rounded-2xl animate-bannerSlideIn">
            <Bell size={16} className="shrink-0" />
            <span>
              {newCount} new {newCount === 1 ? "order" : "orders"} waiting to be
              started
            </span>
          </div>
        )}
      </div>

      {/* Board */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-7xl mx-auto">
        {columns.map(({ status, label, icon: ColumnIcon }) => {
          const columnOrders = orders.filter((o) => o.status === status);
          const style = columnStyles[status];

          return (
            <div key={status} className="flex flex-col min-w-0">
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-2xl mb-3 ${style.header}`}
              >
                <div className="flex items-center gap-2">
                  <ColumnIcon size={18} className={style.icon} />
                  <span className="font-semibold text-sm">{label}</span>
                </div>
                <span className="text-xs font-bold tabular-nums bg-white/60 px-2 py-0.5 rounded-full transition-all duration-300">
                  {columnOrders.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {columnOrders.length === 0 ? (
                  <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl py-8 text-center text-sm text-[#6B7280] transition-all duration-300">
                    No orders here
                  </div>
                ) : (
                  columnOrders.map((order, index) => (
                    <div
                      id={`order-${order.id}`}
                      key={order.id}
                      className={`bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] p-4 transition-all duration-300 ${
                        animatedOrders.has(order.id)
                          ? "animate-orderSlideIn"
                          : "hover:shadow-[0_4px_12px_rgba(31,41,55,0.1)] hover:-translate-y-0.5"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <User size={16} className="text-[#6B7280] shrink-0" />
                          <span className="font-semibold text-[#1F2937] truncate">
                            {order.customerName}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${style.badge}`}
                        >
                          {minutesAgo(order.placedAt)}m ago
                        </span>
                      </div>

                      <div className="space-y-1 mb-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="shrink-0 w-5 h-5 rounded-full bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold flex items-center justify-center tabular-nums mt-0.5">
                              {item.quantity}
                            </span>
                            <div className="min-w-0">
                              <span className="text-[#1F2937] font-medium">
                                {item.name}
                              </span>
                              {item.notes && (
                                <p className="text-xs text-[#6B7280] italic">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-3">
                        <Smartphone size={12} />
                        <span>Paid via MoMo</span>
                      </div>

                      {status === "ready" ? (
                        <button
                          onClick={() => completeOrder(order.id)}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#16A34A] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#15803D] transition-all duration-200 active:scale-95 hover:shadow-[0_4px_12px_rgba(22,163,74,0.3)]"
                        >
                          <CheckCircle2 size={16} />
                          {actionLabel[status]}
                        </button>
                      ) : (
                        <button
                          onClick={() => advanceStatus(order.id)}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#D97706] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#78350F] transition-all duration-200 active:scale-95 hover:shadow-[0_4px_12px_rgba(217,119,6,0.3)]"
                        >
                          {actionLabel[status]}
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add keyframe animations via style tag */}
      <style>{`
        @keyframes toastIn {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes orderSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes orderExit {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
        }
        
        @keyframes bannerSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes notificationPulse {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.3);
          }
          50% {
            transform: scale(0.9);
          }
          75% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-toastIn {
          animation: toastIn 0.3s ease-out forwards;
        }
        
        .animate-orderSlideIn {
          animation: orderSlideIn 0.3s ease-out forwards;
        }
        
        .animate-orderExit {
          animation: orderExit 0.3s ease-in forwards;
        }
        
        .animate-bannerSlideIn {
          animation: bannerSlideIn 0.4s ease-out forwards;
        }

        .animate-notificationPulse {
          animation: notificationPulse 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default KitchenDisplay;
