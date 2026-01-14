import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscount extends Document {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  applicableTo: string[]; // e.g., ['accommodation', 'consultancy', 'events']
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdBy: string; // user email
}

const DiscountSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minPurchase: { type: Number },
  maxDiscount: { type: Number },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  applicableTo: [{ type: String }],
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, required: true },
});

export default mongoose.models.Discount || mongoose.model<IDiscount>('Discount', DiscountSchema);