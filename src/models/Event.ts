import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  maxAttendees?: number;
  currentAttendees: number;
  price?: number;
  status: 'Active' | 'Cancelled' | 'Completed';
}

const EventSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  organizerName: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  organizerPhone: { type: String, required: true },
  maxAttendees: { type: Number },
  currentAttendees: { type: Number, default: 0 },
  price: { type: Number },
  status: { type: String, enum: ['Active', 'Cancelled', 'Completed'], default: 'Active' },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);