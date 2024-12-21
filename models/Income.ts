import mongoose from "mongoose";

interface IncomeSchemaProps extends mongoose.Document {
  totalAmount: number;
  dateOfTransaction: Date;
  category: string;
  cogs: number;
  grossProfit: number;
  taxAmount: number;
  processingFees: number;
  netProfit: number;
  comment: string;
}

const IncomeSchema = new mongoose.Schema<IncomeSchemaProps>({
  totalAmount: { type: Number, required: true, default: 0 },
  dateOfTransaction: { type: Date, required: true, default: Date.now },
  category: { type: String, required: true, default: "General" },
  cogs: { type: Number, required: true, default: 0 },
  grossProfit: { type: Number, required: true, default: 0 },
  taxAmount: { type: Number, required: true, default: 0.06 },
  processingFees: { type: Number, required: true, default: 0 },
  netProfit: { type: Number, required: true, default: 0 },
  comment: { type: String, required: false },
});

export default mongoose.models.Income ||
  mongoose.model<IncomeSchemaProps>("Income", IncomeSchema);
