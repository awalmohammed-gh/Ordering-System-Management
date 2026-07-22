import { useState, useEffect } from "react";
import { listOrders } from "../../api/frontApis";
import Loading from "../../ui/Loading";
import Toast from "../../ui/Toast";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Search,
  Eye,
  ChevronDown,
  X,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: string;
  paymentStatus: "paid" | "unpaid" | "refunded";
  createdAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleOrdersList = async () => {
    try {
      setIsLoading(true);
      const { data } = await listOrders();
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else {
        setToast({
          message: data.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setToast({
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleOrdersList();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700";
      case "unpaid":
        return "bg-red-50 text-red-700";
      case "refunded":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "processing":
        return <Package size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937]">Orders</h2>
          <p className="text-sm text-[#6B7280]">
            View all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6B7280] bg-[#FFFBF5] px-4 py-2 rounded-xl border border-[#E5E7EB]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Orders
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Orders</p>
          <p className="text-2xl font-bold text-[#1F2937]">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Processing</p>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter((o) => o.status === "processing").length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] transition-all duration-200"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-10 py-2.5 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] transition-all duration-200 appearance-none min-w-[150px]"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FFFBF5] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Date
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#6B7280]">
                    {searchTerm || statusFilter !== "all"
                      ? "No orders found matching your filters"
                      : "No orders yet"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FFFBF5] transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-[#1F2937] text-sm">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-[#1F2937]">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-[#6B7280] text-sm">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 font-bold text-[#78350F]">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6B7280] text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 rounded-xl hover:bg-[#FFF7ED] text-[#6B7280] hover:text-[#D97706] transition-all duration-200"
                          aria-label="View order details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#FFFBF5] flex items-center justify-between">
          <p className="text-sm text-[#6B7280]">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      </div>

      {/* Order Details Modal - Read Only */}
      {showDetailsModal && selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm z-40"
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedOrder(null);
            }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 shadow-[0_24px_48px_-12px_rgba(31,41,55,0.35)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1F2937]">
                  Order Details
                </h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="p-1 rounded-full hover:bg-[#E5E7EB] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Read Only Badge */}
              <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFBF5] border border-[#E5E7EB] rounded-full text-xs text-[#6B7280]">
                <Eye size={14} />
                Read Only
              </div>

              <div className="space-y-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280]">Order ID</p>
                    <p className="font-medium text-[#1F2937]">
                      #{selectedOrder.id.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Customer</p>
                    <p className="font-medium text-[#1F2937]">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Date</p>
                    <p className="font-medium text-[#1F2937] text-sm">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Payment Method</p>
                    <p className="font-medium text-[#1F2937]">
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Order Status</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mt-1 ${getStatusColor(
                        selectedOrder.status,
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Payment Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getPaymentStatusColor(
                        selectedOrder.paymentStatus,
                      )}`}
                    >
                      {selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                        selectedOrder.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-[#6B7280] mb-2">Items</p>
                  <div className="bg-[#FFFBF5] rounded-xl p-4 space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[#1F2937]">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium text-[#78350F]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[#E5E7EB] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1F2937]">Total</span>
                    <span className="text-2xl font-bold text-[#78350F]">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-[#FFFBF5] rounded-xl p-4 border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
                    This is a read-only view. Status updates are not available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
