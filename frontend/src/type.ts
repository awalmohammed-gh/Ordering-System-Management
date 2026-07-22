export interface CustomizationOption {
  id: number;
  name: string;
  price?: number;
}

export interface ProductCustomization {
  size?: CustomizationOption | null;
  temperature?: CustomizationOption | null;
  milk?: CustomizationOption | null;
  sweetness?: CustomizationOption | null;
  espressoShot?: CustomizationOption | null;
  syrups?: CustomizationOption[];
  extras?: CustomizationOption[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  finalPrice?: number;
  image: string[];
  category: string;
  customization?: ProductCustomization;
}

export interface CartItems {
  quantity: number;
  product: Product;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AddProduct {
  name: string;
  price: string;
  category: string;
  image: File | null;
  isAvailable: boolean;
}