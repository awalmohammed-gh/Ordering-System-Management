import { useEffect } from "react";
import { useODMContext } from "../../context/ODMContextProvider";
import CustomizationForm from "../../pages/CustomizationForm";
import { CupSoda, X } from "lucide-react";

const CustomizationModal = () => {
  const { showCustomization, selectedProduct, closeCustomize } =
    useODMContext();

  useEffect(() => {
    if (!showCustomization) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCustomize();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCustomization, closeCustomize]);

  if (!showCustomization || !selectedProduct) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4 animate-fadeIn"
      onClick={closeCustomize}
      role="presentation"
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-[0_24px_48px_-12px_rgba(31,41,55,0.4)] max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customize-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-[#D97706]/10 p-2 rounded-xl shrink-0">
              <CupSoda className="w-5 h-5 text-[#D97706]" />
            </div>
            <div className="min-w-0">
              <h2
                id="customize-modal-title"
                className="text-base sm:text-lg font-bold text-[#1F2937] tracking-tight truncate"
              >
                Customize Your Order
              </h2>
              <p className="text-xs text-[#6B7280] hidden sm:block">
                Make it just the way you like it
              </p>
            </div>
          </div>
          <button
            onClick={closeCustomize}
            aria-label="Close customization"
            className="p-2.5 hover:bg-[#FFF7ED] rounded-full transition-colors duration-200 text-[#6B7280] hover:text-[#1F2937] shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drag handle - mobile bottom-sheet affordance */}
        <div className="sm:hidden flex justify-center pt-2 -mt-2">
          <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <CustomizationForm product={selectedProduct} />
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
