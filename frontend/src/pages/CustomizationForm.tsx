import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { coffeeCustomizations } from "../assets/mock_data";
import { useODMContext } from "../context/ODMContextProvider";
import type { Product } from "../type";
import { Minus, Plus, ShoppingBag } from "lucide-react";

interface CustomizationFormProps {
  product: Product;
}

interface CustomizationOption {
  id: number;
  name: string;
  price?: number;
}

const CustomizationForm = ({ product }: CustomizationFormProps) => {
  const { addToCart, setIsCartOpen, closeCustomize, cartItems, updateQuantity, removeFromCart} = useODMContext();

  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState<CustomizationOption | null>(
    coffeeCustomizations.sizes[0] || null,
  );

  const [selectedMilk, setSelectedMilk] = useState<CustomizationOption | null>(
    coffeeCustomizations.milkOptions[0] || null,
  );

  const [selectedTemperature, setSelectedTemperature] =
    useState<CustomizationOption | null>(
      coffeeCustomizations.temperatures[0] || null,
    );

  const [selectedSweetness, setSelectedSweetness] =
    useState<CustomizationOption | null>(
      coffeeCustomizations.sweetness[0] || null,
    );

  const [selectedShot, setSelectedShot] = useState<CustomizationOption | null>(
    coffeeCustomizations.espressoShots[0] || null,
  );

  const [selectedSyrups, setSelectedSyrups] = useState<CustomizationOption[]>(
    [],
  );

  const [selectedExtras, setSelectedExtras] = useState<CustomizationOption[]>(
    [],
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);
  };

  const handleSelection = (
    item: CustomizationOption,
    setState: Dispatch<SetStateAction<CustomizationOption[]>>,
  ) => {
    setState((prev) => {
      const exists = prev.some((data) => data.id === item.id);
      if (exists) {
        return prev.filter((data) => data.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const customizationPrice = useMemo(() => {
    return (
      (selectedSize?.price || 0) +
      (selectedMilk?.price || 0) +
      (selectedShot?.price || 0) +
      selectedSyrups.reduce((total, item) => total + (item.price || 0), 0) +
      selectedExtras.reduce((total, item) => total + (item.price || 0), 0)
    );
  }, [
    selectedSize,
    selectedMilk,
    selectedShot,
    selectedSyrups,
    selectedExtras,
  ]);

  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const displayQuantity = inCart ? cartItem.quantity : quantity;


  const handleDecrease = () =>{
    if(inCart){
        if(cartItem.quantity > 1){
            updateQuantity(product.id, quantity - 1)
        }else{
            removeFromCart(product.id)
        }
    }else{
        setQuantity(Math.max(1, quantity - 1))
    }
  }


  const handleIncrease = () =>{
    if(inCart){
        updateQuantity(product.id, quantity + 1) ;
    }else{
        setQuantity((prev) => prev + 1)
    }
  }

  const finalPrice = useMemo(() => {
    return (product.price + customizationPrice) * quantity;
  }, [product.price, customizationPrice, quantity]);

  const handleAddToCart = () => {
    const productCart = {
      ...product,
      finalPrice,
      customization: {
        size: selectedSize,
        temperature: selectedTemperature,
        milk: selectedMilk,
        sweetness: selectedSweetness,
        espressoShot: selectedShot,
        syrups: selectedSyrups,
        extras: selectedExtras,
      },
    };

    addToCart(productCart, quantity);
    setIsCartOpen(true);
    closeCustomize();
  };

  const optionBase =
    "rounded-2xl border-2 transition-all duration-200 text-sm font-medium";
  const optionActive =
    "border-[#D97706] bg-[#FFF7ED] text-[#78350F] shadow-[0_4px_12px_-4px_rgba(217,119,6,0.35)]";
  const optionIdle =
    "border-[#E5E7EB] bg-[#FFFBF5] text-[#6B7280] hover:border-[#D97706]/50 hover:bg-[#FFF7ED]";
  const sectionLabel =
    "text-[11px] font-semibold uppercase tracking-widest text-[#6B7280] mb-2.5";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Product Info */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight truncate">
            {product.name}
          </h3>
          <p className="text-[#6B7280] text-sm">{product.category}</p>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-[#78350F] tabular-nums shrink-0">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Customization Options */}
      <div className="space-y-5 max-h-[45vh] sm:max-h-100 overflow-y-auto pr-2 custom-scrollbar">
        {/* Size */}
        <div>
          <h4 className={sectionLabel}>Select Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {coffeeCustomizations.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`px-2 sm:px-4 py-3 ${optionBase} ${
                  selectedSize?.id === size.id ? optionActive : optionIdle
                }`}
              >
                <div className="text-center">
                  <span className="block font-semibold text-xs sm:text-sm">
                    {size.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#6B7280]">
                    {formatPrice(size.price || 0)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div>
          <h4 className={sectionLabel}>Temperature</h4>
          <div className="flex gap-2">
            {coffeeCustomizations.temperatures.map((temp) => (
              <button
                key={temp.id}
                onClick={() => setSelectedTemperature(temp)}
                className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm ${optionBase} ${
                  selectedTemperature?.id === temp.id
                    ? optionActive
                    : optionIdle
                }`}
              >
                {temp.name}
              </button>
            ))}
          </div>
        </div>

        {/* Milk */}
        <div>
          <h4 className={sectionLabel}>Milk</h4>
          <div className="grid grid-cols-2 gap-2">
            {coffeeCustomizations.milkOptions.map((milk) => (
              <button
                key={milk.id}
                onClick={() => setSelectedMilk(milk)}
                className={`px-2 sm:px-4 py-3 ${optionBase} ${
                  selectedMilk?.id === milk.id ? optionActive : optionIdle
                }`}
              >
                <div className="text-center">
                  <span className="block font-semibold text-xs sm:text-sm">
                    {milk.name}
                  </span>
                  {milk.price && milk.price > 0 && (
                    <span className="text-[10px] sm:text-xs text-[#6B7280]">
                      +{formatPrice(milk.price)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sweetness */}
        <div>
          <h4 className={sectionLabel}>Sweetness Level</h4>
          <div className="flex flex-wrap gap-2">
            {coffeeCustomizations.sweetness.map((sweet) => (
              <button
                key={sweet.id}
                onClick={() => setSelectedSweetness(sweet)}
                className={`flex-1 min-w-22 px-2 sm:px-4 py-3 text-xs sm:text-sm ${optionBase} ${
                  selectedSweetness?.id === sweet.id ? optionActive : optionIdle
                }`}
              >
                {sweet.name}
              </button>
            ))}
          </div>
        </div>

        {/* Espresso Shot */}
        <div>
          <h4 className={sectionLabel}>Espresso Shot</h4>
          <div className="grid grid-cols-3 gap-2">
            {coffeeCustomizations.espressoShots.map((shot) => (
              <button
                key={shot.id}
                onClick={() => setSelectedShot(shot)}
                className={`px-2 sm:px-4 py-3 ${optionBase} ${
                  selectedShot?.id === shot.id ? optionActive : optionIdle
                }`}
              >
                <div className="text-center">
                  <span className="block font-semibold text-xs sm:text-sm">
                    {shot.name}
                  </span>
                  {shot.price && shot.price > 0 && (
                    <span className="text-[10px] sm:text-xs text-[#6B7280]">
                      +{formatPrice(shot.price)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Syrups */}
        <div>
          <h4 className={sectionLabel}>Syrups (Optional)</h4>
          <div className="flex flex-wrap gap-2">
            {coffeeCustomizations.syrups.map((syrup) => (
              <button
                key={syrup.id}
                onClick={() => handleSelection(syrup, setSelectedSyrups)}
                className={`px-3 sm:px-4 py-2 rounded-full border-2 text-xs sm:text-sm transition-all duration-200 font-medium ${
                  selectedSyrups.some((item) => item.id === syrup.id)
                    ? optionActive
                    : optionIdle
                }`}
              >
                {syrup.name}
                {syrup.price && syrup.price > 0 && (
                  <span className="ml-1 text-[10px] sm:text-xs">
                    +{formatPrice(syrup.price)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Extras */}
        <div>
          <h4 className={sectionLabel}>Extras (Optional)</h4>
          <div className="flex flex-wrap gap-2">
            {coffeeCustomizations.extras.map((extra) => (
              <button
                key={extra.id}
                onClick={() => handleSelection(extra, setSelectedExtras)}
                className={`px-3 sm:px-4 py-2 rounded-full border-2 text-xs sm:text-sm transition-all duration-200 font-medium ${
                  selectedExtras.some((item) => item.id === extra.id)
                    ? optionActive
                    : optionIdle
                }`}
              >
                {extra.name}
                {extra.price && extra.price > 0 && (
                  <span className="ml-1 text-[10px] sm:text-xs">
                    +{formatPrice(extra.price)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h4 className={sectionLabel}>Quantity</h4>
        <div className="flex items-center gap-3 sm:gap-4 bg-[#FFFBF5] rounded-2xl p-2 w-fit">
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E7EB] text-[#1F2937] hover:border-[#D97706] hover:text-[#D97706] transition-all duration-200 flex items-center justify-center active:scale-90 disabled:opacity-40"
            onClick={handleDecrease}
            disabled={quantity <= 1}
          >
            <Minus size={18} />
          </button>
          <span className="text-lg sm:text-xl font-bold text-[#1F2937] min-w-8 text-center tabular-nums">
            {displayQuantity}
          </span>
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E7EB] text-[#1F2937] hover:border-[#D97706] hover:text-[#D97706] transition-all duration-200 flex items-center justify-center active:scale-90"
            onClick={handleIncrease}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-[#E5E7EB] pt-4 space-y-2.5 bg-[#FFFBF5] -mx-1 px-1 rounded-2xl">
        <div className="flex items-center justify-between text-sm px-3 pt-2">
          <span className="text-[#6B7280]">Subtotal</span>
          <span className="font-medium text-[#1F2937] tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>
        {customizationPrice > 0 && (
          <div className="flex items-center justify-between text-sm px-3">
            <span className="text-[#6B7280]">Customizations</span>
            <span className="font-medium text-[#78350F] tabular-nums">
              +{formatPrice(customizationPrice)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-lg font-bold pt-2.5 px-3 pb-3 border-t border-[#E5E7EB]">
          <span className="text-[#1F2937]">Total</span>
          <span className="text-[#78350F] tabular-nums">
            {formatPrice(finalPrice)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-1">
        <button
          className="flex-1 px-6 py-3.5 rounded-2xl border-2 border-[#E5E7EB] text-[#6B7280] font-medium hover:bg-[#FFF7ED] hover:border-[#D97706]/40 hover:text-[#78350F] transition-all duration-200"
          onClick={() =>{closeCustomize() ; setIsCartOpen(true)}}
        >
          Cancel
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D97706] text-white font-semibold shadow-[0_10px_20px_-8px_rgba(217,119,6,0.5)] hover:bg-[#78350F] hover:shadow-[0_12px_24px_-8px_rgba(120,53,15,0.45)] transition-all duration-200 active:scale-95"
          onClick={handleAddToCart}
        >
          <ShoppingBag size={18} />
          Add to Cart · {formatPrice(finalPrice)}
        </button>
      </div>
    </div>
  );
};

export default CustomizationForm;
