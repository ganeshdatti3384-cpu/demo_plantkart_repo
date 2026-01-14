import mongoose, { Schema, Document } from 'mongoose';

export interface IConsultant extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number; // years
  languages: string[];
  bio: string;
  profileImage: string;
  certifications: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: boolean;
  location: string;
  services: string[];
  totalClients: number;
  joinedDate: Date;
}

const ConsultantSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: [{ type: String }],
  experience: { type: Number, required: true },
  languages: [{ type: String }],
  bio: { type: String, required: true },
  profileImage: { type: String, required: true },
  certifications: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  hourlyRate: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  location: { type: String, required: true },
  services: [{ type: String }],
  totalClients: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
});

export default mongoose.models.Consultant || mongoose.model<IConsultant>('Consultant', ConsultantSchema);