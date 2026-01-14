import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
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
}

const UserProfileSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
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
});

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);