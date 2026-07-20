import mongoose from "mongoose";
import dns from "dns"

dns.setServers(["1.1.1.1","8.8.8.8"])

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    await mongoose.connect(process.env.MONGO_URI as string);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
