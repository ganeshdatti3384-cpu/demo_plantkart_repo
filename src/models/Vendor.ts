import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: 'vehicle_rental' | 'accommodation' | 'event_organizer' | 'consultancy' | 'other';
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  licenseNumber: string;
  taxId: string;
  profileImage: string;
  documents: string[]; // URLs to uploaded documents
  rating: number;
  reviewCount: number;
  totalListings: number;
  isVerified: boolean;
  isActive: boolean;
  joinedDate: Date;
  services: string[];
}

const VendorSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  businessType: {
    type: String,
    enum: ['vehicle_rental', 'accommodation', 'event_organizer', 'consultancy', 'other'],
    required: true
  },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  website: { type: String },
  licenseNumber: { type: String, required: true },
  taxId: { type: String, required: true },
  profileImage: { type: String, required: true },
  documents: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  totalListings: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  joinedDate: { type: Date, default: Date.now },
  services: [{ type: String }],
});

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);