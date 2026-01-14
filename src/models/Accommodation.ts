import mongoose, { Schema, Document } from 'mongoose';

export interface IAccommodation extends Document {
  id: string;
  title: string;
  address: string;
  price: string;
  period: 'day' | 'week' | 'month';
  beds: number;
  baths: number;
  imageUrl: string;
  status: 'Available' | 'Rented' | 'Unavailable';
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

const AccommodationSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, enum: ['day', 'week', 'month'], required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Rented', 'Unavailable'], required: true },
  ownerName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  ownerPhone: { type: String, required: true },
});

export default mongoose.models.Accommodation || mongoose.model<IAccommodation>('Accommodation', AccommodationSchema);