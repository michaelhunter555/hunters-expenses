import mongoose from "mongoose";

interface ExpenseSchemaProps extends mongoose.Document {
  initialAmount: number;
  amountOwed: number;
  lastUpdateDate: Date;
  totalDeduction: number;
  nextPaymentDue: Date;
  startDate: Date;
  category: string;
  taxAmount: number;
  comment: string;
}

const ExpenseSchema = new mongoose.Schema<ExpenseSchemaProps>({
  totalDeduction: { type: Number, required: true, default: 0 },
  initialAmount: { type: Number, required: true, default: 0 },
  startDate: { type: Date, required: true, default: Date.now },
  nextPaymentDue: { type: Date, required: false },
  lastUpdateDate: { type: Date, required: true, default: Date.now },
  category: { type: String, required: true, default: "General" },
  taxAmount: { type: Number, required: true, default: 0.06 },
  comment: { type: String, required: false },
});

export default mongoose.models.Expense ||
  mongoose.model<ExpenseSchemaProps>("Expense", ExpenseSchema);
