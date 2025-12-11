import mongoose, { Schema, Model } from 'mongoose';
import type { User } from '@/types';

const ShippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  wilaya: { type: String, required: true },
  postalCode: { type: String },
}, { _id: false });

const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [ShippingAddressSchema],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;
