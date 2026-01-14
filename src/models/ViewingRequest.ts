import mongoose, { Schema, Document } from 'mongoose';

export interface IViewingRequest extends Document {
  id: string;
  accommodationId: string;
  accommodationTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const ViewingRequestSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  accommodationId: { type: String, required: true },
  accommodationTitle: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], required: true },
});

export default mongoose.models.ViewingRequest || mongoose.model<IViewingRequest>('ViewingRequest', ViewingRequestSchema);