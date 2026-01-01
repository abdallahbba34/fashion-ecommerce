import mongoose, { Schema, Model } from 'mongoose';
import type { Order } from '@/types';

const ShippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  wilaya: { type: String, required: true },
  postalCode: { type: String },
}, { _id: false });

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
}, { _id: false });

const OrderSchema = new Schema<Order>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String },
    guestEmail: { type: String },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    billingAddress: ShippingAddressSchema,
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'bank_transfer', 'online'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    notes: { type: String },
    trackingNumber: { type: String },
    stopDeskId: { type: Number },
    // Tracking de la source de la commande
    source: {
      type: String,
      enum: ['website', 'facebook', 'instagram', 'whatsapp', 'other'],
      default: 'website'
    },
    referralInfo: { type: String }, // Pour stocker des infos supplémentaires (ex: nom de la campagne)
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });

const OrderModel: Model<Order> =
  mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);

export default OrderModel;
