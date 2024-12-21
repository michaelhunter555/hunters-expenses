import mongoose from "mongoose";

interface TransactionProps extends mongoose.Document {
  type: "income" | "expense";
  totalAmount?: number;
  dateOfTransaction?: Date;
  category?: string;
  cogs?: number;
  grossProfit?: number;
  taxAmount?: number;
  processingFees?: number;
  netProfit?: number;
  comment?: string;
  initialAmount?: number;
  amountOwed?: number;
  lastUpdateDate?: Date;
  totalDeduction?: number;
  nextPaymentDue?: Date;
  startDate?: Date;
}

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["income", "expense"], required: true },
  totalAmount: { type: Number, required: true, default: 0 },
  dateOfTransaction: { type: Date, required: true, default: Date.now },
  category: { type: String, required: true, default: "General" },
  cogs: { type: Number, required: true, default: 0 },
  grossProfit: { type: Number, required: true, default: 0 },
  taxAmount: { type: Number, required: true, default: 0.06 },
  processingFees: { type: Number, required: true, default: 0 },
  netProfit: { type: Number, required: true, default: 0 },
  comment: { type: String, required: false },
  totalDeduction: { type: Number, required: true, default: 0 },
  initialAmount: { type: Number, required: true, default: 0 },
  startDate: { type: Date, required: true, default: Date.now },
  nextPaymentDue: { type: Date, required: false },
  lastUpdateDate: { type: Date, required: true, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model<TransactionProps>("Transaction", TransactionSchema);
