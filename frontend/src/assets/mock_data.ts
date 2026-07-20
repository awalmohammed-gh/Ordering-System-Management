import type { Product } from "../type";
import img1 from "./Affogato.jpg";
import img2 from "./Americano.jpg";
import img3 from "./Caramel_Macchiato.jpg";
import img4 from "./Cortado.jpg";
import img5 from "./cuppacino.jpg";
import img7 from "./flat_white.jpg";
import img8 from "./Latte.jpg";
import img9 from "./Macchiato.jpg";
import img10 from "./Mocha.jpg";
import img11 from "./Vanilla_Latte.jpg";



export const coffeeCustomizations = {
  sizes: [
    { id: 1, name: "Small", price: 0 },
    { id: 2, name: "Medium", price: 5 },
    { id: 3, name: "Large", price: 10 },
  ],

  temperatures: [
    { id: 1, name: "Hot" },
    { id: 2, name: "Warm" },
    { id: 3, name: "Iced" },
  ],

  milkOptions: [
    { id: 1, name: "Whole Milk", price: 0 },
    { id: 2, name: "Skim Milk", price: 0 },
    { id: 3, name: "Oat Milk", price: 8 },
    { id: 4, name: "Almond Milk", price: 8 },
    { id: 5, name: "Soy Milk", price: 6 },
    { id: 6, name: "Coconut Milk", price: 8 },
  ],

  sweetness: [
    { id: 1, name: "No Sugar" },
    { id: 2, name: "Less Sugar" },
    { id: 3, name: "Normal" },
    { id: 4, name: "Extra Sweet" },
  ],

  espressoShots: [
    { id: 1, name: "Single Shot", price: 0 },
    { id: 2, name: "Double Shot", price: 8 },
    { id: 3, name: "Triple Shot", price: 15 },
  ],

  syrups: [
    { id: 1, name: "Vanilla", price: 5 },
    { id: 2, name: "Caramel", price: 5 },
    { id: 3, name: "Hazelnut", price: 5 },
    { id: 4, name: "Chocolate", price: 6 },
    { id: 5, name: "Irish Cream", price: 6 },
  ],

  extras: [
    { id: 1, name: "Whipped Cream", price: 5 },
    { id: 2, name: "Extra Foam", price: 3 },
    { id: 3, name: "Cinnamon", price: 2 },
    { id: 4, name: "Chocolate Drizzle", price: 4 },
    { id: 5, name: "Caramel Drizzle", price: 4 },
    { id: 6, name: "Marshmallows", price: 5 },
  ],
};

export const products: Product[] = [
  {
    id: "A1B2C3D4",
    name: "Caramel Macchiato",
    price: 75.0,
    category: "Specialty Coffee",
    image: [img3],
  },
  {
    id: "E5F6G7H8",
    name: "Vanilla Latte",
    price: 70.0,
    category: "Latte",
    image: [img11],
  },
  {
    id: "J9K0L1M2",
    name: "Affogato",
    price: 80.0,
    category: "Specialty Coffee",
    image: [img1],
  },
  {
    id: "N3P4Q5R6",
    name: "Cortado",
    price: 55.0,
    category: "Hot Coffee",
    image: [img4],
  },
  {
    id: "S7T8U9V0",
    name: "Mocha",
    price: 75.0,
    category: "Chocolate Coffee",
    image: [img10],
  },
  {
    id: "W1X2Y3Z4",
    name: "Macchiato",
    price: 50.0,
    category: "Espresso",
    image: [img9],
  },
  {
    id: "B5C6D7E8",
    name: "Flat White",
    price: 65.0,
    category: "Milk Coffee",
    image: [img7],
  },
  {
    id: "F9G0H1J2",
    name: "Latte",
    price: 65.0,
    category: "Latte",
    image: [img8],
  },
  {
    id: "K3L4M5N6",
    name: "Americano",
    price: 50.0,
    category: "Espresso",
    image: [img2],
  },
  {
    id: "P7Q8R9S0",
    name: "Cappuccino",
    price: 65.0,
    category: "Milk Coffee",
    image: [img5],
  },
];