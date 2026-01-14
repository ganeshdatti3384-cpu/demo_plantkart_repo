import mongoose, { Schema, Document } from 'mongoose';

export interface IPickupRequest extends Document {
  id: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    citizenship: string;
    passport?: string;
    residentialAddress?: string;
    country?: string;
    hasVisa?: 'Yes' | 'No';
    visaType?: string;
    visaTenure?: string;
    isStudent?: 'Yes' | 'No';
    universityName?: string;
    course?: string;
    collegeAddress?: string;
  };
  flightNumber: string;
  arrivalDate: string;
  arrivalTime: string;
  passengers: string;
  dropoffAddress: string;
  status: 'Pending' | 'Approved' | 'Completed';
}

const PickupRequestSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    citizenship: { type: String, required: true },
    passport: { type: String },
    residentialAddress: { type: String },
    country: { type: String },
    hasVisa: { type: String, enum: ['Yes', 'No'] },
    visaType: { type: String },
    visaTenure: { type: String },
    isStudent: { type: String, enum: ['Yes', 'No'] },
    universityName: { type: String },
    course: { type: String },
    collegeAddress: { type: String },
  },
  flightNumber: { type: String, required: true },
  arrivalDate: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  passengers: { type: String, required: true },
  dropoffAddress: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Completed'], required: true },
});

export default mongoose.models.PickupRequest || mongoose.model<IPickupRequest>('PickupRequest', PickupRequestSchema);