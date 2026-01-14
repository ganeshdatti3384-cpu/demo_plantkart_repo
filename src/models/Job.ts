import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  tags: string;
  applyUrl: string;
}

const JobSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  tags: { type: String, required: true },
  applyUrl: { type: String, required: true },
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);