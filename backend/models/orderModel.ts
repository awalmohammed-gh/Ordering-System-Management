import mongoose, { Schema, Document, Model } from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  size?: string;
}

export interface OrderDocument extends Document {
  orderName: string;
  items: OrderItem[];
  paymentMethod: "cash" | "emoney";
  amountReceived?: number;
  total: number;
  change?: number;
  paymentStatus: "paid" | "pending" | "failed";
  orderStatus: "pending" | "preparing" | "ready" | "completed";
  createdAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    orderName: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        size: {
          type: String,
        },
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["cash", "emoney"],
      required: true,
    },

    amountReceived: {
      type: Number,
    },

    total: {
      type: Number,
      required: true,
    },

    change: {
      type: Number,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Order : Model<OrderDocument> = mongoose.models.Order || mongoose.model<OrderDocument>("Order", orderSchema);