import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  id: string;
  name: string;
  type: 'car' | 'van' | 'bus' | 'motorcycle';
  vehicleModel: string;
  year: number;
  capacity: number;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  location: string;
  features: string[];
  images: string[];
  availability: boolean;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  licensePlate: string;
  insuranceExpiry: Date;
  lastMaintenance: Date;
}

const VehicleSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['car', 'van', 'bus', 'motorcycle'], required: true },
  vehicleModel: { type: String, required: true },
  year: { type: Number, required: true },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  pricePerWeek: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  location: { type: String, required: true },
  features: [{ type: String }],
  images: [{ type: String }],
  availability: { type: Boolean, default: true },
  vendorName: { type: String, required: true },
  vendorEmail: { type: String, required: true },
  vendorPhone: { type: String, required: true },
  licensePlate: { type: String, required: true },
  insuranceExpiry: { type: Date, required: true },
  lastMaintenance: { type: Date, required: true },
});

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);