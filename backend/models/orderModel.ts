import mongoose, { Schema, Document, Model } from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface OrderDocument extends Document {
  orderName: string;
  notes?: string;
  items: OrderItem[];
  paymentMethod: "cashier" | "paystack";
  amountReceived?: number;
  total: number;
  change?: number;
  paymentStatus: "paid" | "pending" | "failed" | "unpaid";
  status: "pending" | "preparing" | "ready" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    orderName: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["cashier", "paystack"],
      required: true,
    },

    amountReceived: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    change: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed", "unpaid"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Order: Model<OrderDocument> =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", orderSchema);
