import { useState } from "react";
import { Search, X, Coffee, Grid3x3, List } from "lucide-react";
import { products } from "../assets/mock_data";
import ProductCard from "../components/card/ProductCard";
import CartButton from "../components/card/CartButton";

const MenuPage = () => {
  const [selectCategory, setSelectCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProduct = products.filter((item) => {
    const matchCategory =
      selectCategory === "All" ? true : item.category === selectCategory;
    const matchSearch =
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <section className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-20 shadow-[0_4px_16px_-4px_rgba(31,41,55,0.08)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4">
            {/* Brand */}
            <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="bg-[#D97706] p-2 sm:p-2.5 rounded-xl shadow-[0_8px_16px_-6px_rgba(217,119,6,0.45)] shrink-0">
                  <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1F2937] tracking-tight">
                  Sankofa<span className="text-[#D97706]"> Brew</span>
                </h1>
              </div>

              {/* View Toggle - shown here on mobile, next to brand */}
              <div className="flex md:hidden bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-[#D97706] text-white shadow-[0_6px_14px_-4px_rgba(217,119,6,0.5)]"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                  }`}
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-[#D97706] text-white shadow-[0_6px_14px_-4px_rgba(217,119,6,0.5)]"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Search and View Toggle - desktop */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/15 focus:border-[#D97706]/40 text-[#111827] placeholder-[#6B7280] transition-all text-sm sm:text-base"
                />
                {search && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <CartButton/>

              {/* View Toggle - desktop only, avoids duplicate control on mobile */}
              <div className="hidden md:flex bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-[#D97706] text-white shadow-[0_6px_14px_-4px_rgba(217,119,6,0.5)]"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-[#D97706] text-white shadow-[0_6px_14px_-4px_rgba(217,119,6,0.5)]"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs — horizontal, POS-style quick select, scrolls on any width */}
          <div className="relative mt-3 sm:mt-4">
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 sm:-mx-1 px-3 sm:px-1 touch-pan-x scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
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
                    className={`shrink-0 snap-start flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[#1F2937] text-white shadow-[0_10px_20px_-8px_rgba(31,41,55,0.5)]"
                        : "bg-[#FFFBF5] text-[#1F2937] border border-[#E5E7EB] hover:border-[#D97706]/40 hover:text-[#78350F]"
                    }`}
                  >
                    {cat}
                    <span
                      className={`text-[10px] sm:text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-full ${
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
            {/* Edge fade to hint the strip scrolls, hidden once JS/CSS scroll reaches end isn't tracked here — a static cue */}
            <div className="hidden sm:block absolute right-0 top-0 bottom-1 w-10 bg-white/0 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
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

        {/* Product Grid/List */}
        {filteredProduct.length === 0 ? (
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
          <div
            className={`grid gap-3 sm:gap-4 gap-y-5 sm:gap-y-6 ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1"
            }`}
          >
            {filteredProduct.map((product, index) => (
              <ProductCard product={product} key={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuPage;
