import { PlusIcon, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "../../type";
import { useODMContext } from "../../context/ODMContextProvider";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, image, category } = product;
  const [isAdded, setIsAdded] = useState(false);
  const { setShowCustomization, setSelectedProduct } =
    useODMContext();

  const handleAddToCart = () => {
    setIsAdded(true);
    setSelectedProduct(product)
    setShowCustomization(true)
    setTimeout(() => setIsAdded(false), 2000);
    // Add to cart logic here
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`group relative w-full text-left bg-white rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.97] ${
        isAdded
          ? "border-[#16A34A] shadow-[0_8px_20px_-6px_rgba(22,163,74,0.35)]"
          : "border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] active:border-[#D97706]/40"
      }`}
    >
      {/* Image Container */}
      <div className="relative h-36 overflow-hidden bg-[#FFFBF5]">
        <img src={image} alt={name} className="w-full h-full object-cover" />

        {/* Category Badge */}
        <span className="absolute top-2 left-2 bg-[#1F2937]/90 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
          {category}
        </span>

        {/* Added confirmation overlay */}
        <div
          className={`absolute inset-0 bg-[#16A34A]/90 flex items-center justify-center gap-2 text-white font-semibold transition-opacity duration-200 ${
            isAdded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Check size={20} strokeWidth={3} />
          Added
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[15px] font-bold text-[#1F2937] truncate">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[#78350F] font-extrabold text-lg tabular-nums">
            {price.toLocaleString("en-GH", {
              style: "currency",
              currency: "GHS",
            })}
          </p>

          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${
              isAdded
                ? "bg-[#16A34A] text-white"
                : "bg-[#D97706]/10 text-[#D97706]"
            }`}
          >
            <PlusIcon size={16} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
