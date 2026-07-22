import { useEffect, useState } from "react";
import type { Product } from "../../type";
import { deleteProduct, listProduct } from "../../api/frontApis";
import Loading from "../../ui/Loading";
import { Edit, Trash2, Search, X } from "lucide-react";
import Toast from "../../ui/Toast";

const ListProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const { data } = await listProduct();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        setToast({
          message: data.message,
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Something went wrong",
        type: "error",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const { data } = await deleteProduct(id);
      if (data.success) {
        setToast({
          message: data.message,
          type: "success",
        });
        await fetchProduct();
        setShowDeleteModal(false);
        setSelectedProduct(null);
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

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    fetchProduct();
  }, []);

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
          <h2 className="text-2xl font-bold text-[#1F2937]">Products</h2>
          <p className="text-sm text-[#6B7280]">
            Manage your product inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] transition-all duration-200 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Products</p>
          <p className="text-2xl font-bold text-[#1F2937]">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Categories</p>
          <p className="text-2xl font-bold text-[#D97706]">
            {new Set(products.map((p) => p.category)).size}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FFFBF5] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Price
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-[#6B7280]">
                    {searchTerm
                      ? "No products found matching your search"
                      : "No products added yet"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-[#FFFBF5] transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
                            <span className="text-[#D97706] font-bold text-sm">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-[#1F2937]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#6B7280]">
                      {product.category || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#78350F]">
                      {product.price?.toLocaleString("en-GH",{
                        style:"currency",
                        currency:"GHS"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            // Navigate to edit or open modal
                            console.log("Edit product:", product._id);
                          }}
                          className="p-2 rounded-xl hover:bg-[#FFF7ED] text-[#6B7280] hover:text-[#D97706] transition-all duration-200"
                          aria-label="Edit product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(product._id);
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                            
                          }}
                          className="p-2 rounded-xl hover:bg-red-50 text-[#6B7280] hover:text-red-500 transition-all duration-200"
                          aria-label="Delete product"
                        >
                          <Trash2 size={18} />
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
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm z-40"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedProduct(null);
            }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white rounded-2xl p-6 shadow-[0_24px_48px_-12px_rgba(31,41,55,0.35)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1F2937]">
                  Delete Product
                </h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="p-1 rounded-full hover:bg-[#E5E7EB] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-[#6B7280] mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#1F2937]">
                  {selectedProduct.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 px-4 py-3 border border-[#E5E7EB] text-[#6B7280] rounded-xl font-medium hover:bg-[#FFFBF5] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedProduct.id)}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListProduct;
