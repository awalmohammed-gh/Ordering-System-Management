import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { CartItems, Product } from "../type";
import { listProduct } from "../api/frontApis";

interface ODMContextType {
  cartItems: CartItems[];
  setCartItems: Dispatch<SetStateAction<CartItems[]>>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  openCustomize:(product:Product) => void
  closeCustomize:() => void;
  grandTotal:number;
  clearCart:() =>void;

  isCartOpen: boolean;
  setIsCartOpen: Dispatch<SetStateAction<boolean>>;
  showCustomization: boolean;
  setShowCustomization: Dispatch<SetStateAction<boolean>>;
  selectedProduct:Product |null,
  setSelectedProduct:Dispatch<SetStateAction< Product |null>>
}

const ODMContext = createContext<ODMContextType | undefined>(undefined);
export const ODMContextProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItems[]>(()=>{
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : []
  });


  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedProduct,setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product | []>([])
  

  const addToCart = (product: Product, quantity = 1) => {
       setCartItems((prev) =>{
         const checkExist = prev.find((item) => item.product._id === product._id);
         if(checkExist){
         return  prev.map((item) => item.product._id === product._id ? {...item, quantity:item.quantity + quantity} : item)
         }

        return [...prev, {product, quantity}]
       })
  };

  console.log();

  const increaseQuantity = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      ),
    );
  };

  //selected product
  const openCustomize = (product: Product) => {
    setSelectedProduct(product);
    setShowCustomization(true);
  };

  console.log(cartItems);
  //selected product
  const closeCustomize = () => {
    setSelectedProduct(null);
    setShowCustomization(false);
  };

  //update quantity

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  //remove

  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId),
    );

    localStorage.removeItem("cart")
  };

  //grand total
  const grandTotal = useMemo(() =>{
    return cartItems.reduce((total, item) => total + (item.product.finalPrice ?? item.product.price) * item.quantity, 0)
  },[cartItems])


  //clear cart
  const clearCart = () =>{
    setCartItems([]);
  }



    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

  const value: ODMContextType = {
    cartItems,
    setCartItems,
    isCartOpen,
    updateQuantity,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    showCustomization,
    setShowCustomization,
    selectedProduct,
    openCustomize,
    setSelectedProduct,
    closeCustomize,
    grandTotal,
    clearCart
  };
  return <ODMContext.Provider value={value}>{children}</ODMContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useODMContext = () => {
  const context = useContext(ODMContext);

  if (!context) {
    throw new Error("check your context provider");
  }

  return context;
};
