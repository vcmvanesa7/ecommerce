import mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  nameProduct: string;
  description: string;
  price: number;
  createdAt: Date;
  fileUrl: string;
}

const ProductSchema : Schema<IProduct> = new Schema({
  nameProduct: {
    type: String,
    required: [true, 'Product name is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  }
});

export const Products = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema, 'Products');
