import mongoose, { Schema, Document } from 'mongoose';

export interface ILoan extends Document {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  loanType: 'personal' | 'education' | 'business' | 'home' | 'vehicle';
  loanAmount: number;
  loanTerm: number; // in months
  interestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  purpose: string;
  employmentStatus: string;
  annualIncome: number;
  creditScore?: number;
  collateral?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed';
  providerName: string;
  providerEmail: string;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  documents: string[]; // URLs to uploaded documents
  notes?: string;
}

const LoanSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String, required: true },
  loanType: {
    type: String,
    enum: ['personal', 'education', 'business', 'home', 'vehicle'],
    required: true
  },
  loanAmount: { type: Number, required: true },
  loanTerm: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  totalPayment: { type: Number, required: true },
  purpose: { type: String, required: true },
  employmentStatus: { type: String, required: true },
  annualIncome: { type: Number, required: true },
  creditScore: { type: Number },
  collateral: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Disbursed'],
    default: 'Pending'
  },
  providerName: { type: String, required: true },
  providerEmail: { type: String, required: true },
  applicationDate: { type: Date, default: Date.now },
  approvalDate: { type: Date },
  disbursementDate: { type: Date },
  documents: [{ type: String }],
  notes: { type: String },
});

export default mongoose.models.Loan || mongoose.model<ILoan>('Loan', LoanSchema);