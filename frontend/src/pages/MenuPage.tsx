import { useEffect, useState } from "react";
import { Search, X, Coffee, ShoppingBag } from "lucide-react";
import ProductCard from "../components/card/ProductCard";
import type { Product } from "../type";
import { listProduct } from "../api/frontApis";
import CartSidebar from "../components/modal/CartSidebar";
import { useODMContext } from "../context/ODMContextProvider";

const MenuPage = () => {
  const [selectCategory, setSelectCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const { cartItems } = useODMContext();

  const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const { data } = await listProduct();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const filteredProduct = products.filter((item) => {
    const matchCategory =
      selectCategory === "All" ? true : item.category === selectCategory;
    const matchSearch =
      item.category?.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const handleClearSearch = () => {
    setSearch("");
  };

  const toggleMobileCart = () => {
    setIsMobileCartOpen(!isMobileCartOpen);
  };

  return (
    <section className="min-h-screen bg-[#FFFBF5]">
      {/* Header — logo, then search directly below it. Nothing else lives here. */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-20 shadow-[0_4px_16px_-4px_rgba(31,41,55,0.08)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Logo row — cart icon sits in the corner for access, logo stays centered */}
          <div className="relative flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="bg-[#D97706] p-2 sm:p-2.5 rounded-xl shadow-[0_8px_16px_-6px_rgba(217,119,6,0.45)] shrink-0">
                <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1F2937] tracking-tight whitespace-nowrap">
                Sankofa<span className="text-[#D97706]"> Brew</span>
              </h1>
            </div>

            {/* Cart icon - mobile only, absolutely positioned so it never pushes the logo off-center */}
            <div className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2">
              <button
                onClick={toggleMobileCart}
                className="relative focus:outline-none"
                aria-label="Toggle cart"
              >
                <div className="bg-[#D97706] p-2.5 rounded-xl shadow-[0_8px_16px_-6px_rgba(217,119,6,0.45)] hover:bg-[#78350F] transition-colors duration-200">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[1.15rem] h-[1.15rem] px-1 flex items-center justify-center tabular-nums shadow-[0_2px_6px_-1px_rgba(239,68,68,0.5)] animate-pulse">
                    {cartItems.length > 99 ? "99+" : cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search — directly below the logo */}
          <div className="mt-3 sm:mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 sm:py-3 bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/15 focus:border-[#D97706]/40 text-[#111827] placeholder-[#6B7280] transition-all text-sm sm:text-base"
              />
              {search && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category strip — compact, secondary, sits below the header rather than inside it */}
      <div className="bg-[#FFFBF5]/95 backdrop-blur-sm border-b border-[#E5E7EB]/60 sticky top-18.5 sm:top-21 z-10">
        <div className="max-w-full mx-auto px-3 sm:px-6 py-2">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 -mx-3 sm:-mx-1 px-3 sm:px-1 touch-pan-x scrollbar-none justify-start sm:justify-center snap-x snap-mandatory">
            {uniqueCategories.map((cat, index) => {
              const isActive = selectCategory === cat;
              const count =
                cat === "All"
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={index}
                  onClick={() => setSelectCategory(cat)}
                  className={`shrink-0 snap-start flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#1F2937] text-white shadow-[0_6px_14px_-6px_rgba(31,41,55,0.5)]"
                      : "bg-white text-[#1F2937] border border-[#E5E7EB] hover:border-[#D97706]/40 hover:text-[#78350F]"
                  }`}
                >
                  {cat}
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#D97706] text-white"
                        : "bg-[#D97706]/10 text-[#D97706]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content with Cart Sidebar */}
      <div className="flex max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 gap-6">
        {/* Products Section */}
        <div className="flex-1 min-w-0">
          {/* Results info */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="bg-[#D97706]/10 p-2 rounded-xl shrink-0">
              <Coffee className="w-4 h-4 text-[#D97706]" />
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Showing{" "}
              <span className="font-semibold text-[#1F2937] tabular-nums">
                {filteredProduct.length}
              </span>{" "}
              items
              {selectCategory !== "All" && (
                <span className="ml-1">
                  in{" "}
                  <span className="font-semibold text-[#D97706]">
                    {selectCategory}
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#D97706]/20 border-t-[#D97706] animate-spin"></div>
                <p className="text-sm text-[#6B7280]">Loading menu...</p>
              </div>
            </div>
          ) : filteredProduct.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-12 text-center shadow-[0_1px_2px_rgba(31,41,55,0.06)]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D97706]/10 flex items-center justify-center mx-auto mb-4">
                <Search
                  className="w-6 h-6 sm:w-7 sm:h-7 text-[#D97706]"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#1F2937] mb-2">
                No products found
              </h3>
              <p className="text-sm sm:text-base text-[#6B7280]">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 gap-y-5 sm:gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {filteredProduct.map((product, index) => (
                <ProductCard product={product} key={index} />
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar - Always Visible on Desktop */}
        <div className="hidden lg:block w-85 xl:w-95 shrink-0">
          <div className="sticky top-24">
            <CartSidebar isFixed={true} />
          </div>
        </div>
      </div>

      {/* Mobile Cart Sidebar - Sliding with toggle */}
      <div className="lg:hidden">
        {/* Backdrop */}
        {isMobileCartOpen && (
          <div
            className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={toggleMobileCart}
          />
        )}

        {/* Sliding Sidebar */}
        <div
          className={`fixed right-0 top-0 h-full w-full sm:max-w-md bg-[#FFFBF5] z-50 shadow-[0_24px_48px_-12px_rgba(31,41,55,0.35)] flex flex-col transition-transform duration-300 ease-in-out ${
            isMobileCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header with close button */}
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
              onClick={toggleMobileCart}
              aria-label="Close cart"
              className="p-2 rounded-full hover:bg-[#FFF7ED] text-[#1F2937] transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart content */}
          <CartSidebar isFixed={false} />
        </div>
      </div>

      {/* Scrollbar hide styles */}
      <style>{`
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default MenuPage;
