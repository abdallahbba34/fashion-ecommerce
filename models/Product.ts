import mongoose, { Schema, Model } from 'mongoose';
import type { Product } from '@/types';

const ProductVariantSchema = new Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String },
});

const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    category: { type: String, required: true },
    subcategory: { type: String },
    images: [{ type: String }],
    variants: [ProductVariantSchema],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    material: { type: String },
    care: { type: String },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });

const ProductModel: Model<Product> =
  mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);

export default ProductModel;
