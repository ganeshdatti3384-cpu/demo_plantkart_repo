import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  id: string;
  bookingType: 'consultant' | 'vehicle' | 'event' | 'accommodation';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceProviderName: string;
  serviceProviderEmail: string;
  serviceName: string;
  serviceId: string; // ID of the service being booked
  bookingDate: Date;
  startDate?: Date;
  endDate?: Date;
  duration?: string; // e.g., "2 hours", "3 days"
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  notes?: string;
  meetingLink?: string; // for virtual consultations
  location?: string; // for physical services
  participants?: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  bookingType: {
    type: String,
    enum: ['consultant', 'vehicle', 'event', 'accommodation'],
    required: true
  },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  serviceProviderName: { type: String, required: true },
  serviceProviderEmail: { type: String, required: true },
  serviceName: { type: String, required: true },
  serviceId: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now },
  startDate: { type: Date },
  endDate: { type: Date },
  duration: { type: String },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  notes: { type: String },
  meetingLink: { type: String },
  location: { type: String },
  participants: { type: Number },
  specialRequests: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);