import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: string;
  password?: string;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  joinDate: { type: String, required: true },
  status: { type: String, required: true },
  password: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);