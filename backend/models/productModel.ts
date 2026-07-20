import mongoose, {Schema, Document} from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  category: string;
}

const productSchema = new Schema<IProduct>({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    image:{type:String, required:true},
    category:{type:String, required:true}
},{timestamps:true});

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)