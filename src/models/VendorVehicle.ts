
import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorVehicle extends Document {
  id: string;
  vendorName: string;
  listingType: 'For Rent' | 'For Sale';
  make: string;
  model: string;
  year: number;
  transmission: 'Auto' | 'Manual';
  kms: number;
  images: string[];
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  kmLimit?: string;
  salePrice?: number;
  regoExpiry?: string;
  condition?: 'New' | 'Used' | 'Demo';
  status: 'Active' | 'Sold' | 'Rented' | 'Pending Approval';
  bookings: number;
}

const VendorVehicleSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  vendorName: { type: String, required: true },
  listingType: { type: String, enum: ['For Rent', 'For Sale'], required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  transmission: { type: String, enum: ['Auto', 'Manual'], required: true },
  kms: { type: Number, required: true },
  images: [{ type: String }],
  dailyRate: { type: Number },
  weeklyRate: { type: Number },
  monthlyRate: { type: Number },
  kmLimit: { type: String },
  salePrice: { type: Number },
  regoExpiry: { type: String },
  condition: { type: String, enum: ['New', 'Used', 'Demo'] },
  status: { type: String, enum: ['Active', 'Sold', 'Rented', 'Pending Approval'], required: true },
  bookings: { type: Number, default: 0 },
});

export default mongoose.models.VendorVehicle || mongoose.model<IVendorVehicle>('VendorVehicle', VendorVehicleSchema);
