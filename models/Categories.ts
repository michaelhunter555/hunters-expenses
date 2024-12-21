import mongoose from "mongoose";

interface CategoryProps extends mongoose.Document {
  categoryName: string;
  totalTransactions: number;
  totalRevenue: number;
  lastUpdated: Date;
}

const CategorySchema = new mongoose.Schema<CategoryProps>({
  categoryName: { type: String, required: true },
  totalTransactions: { type: Number, required: true, default: 0 },
  totalRevenue: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, required: true, default: Date.now },
});

export default mongoose.models.Category ||
  mongoose.model<CategoryProps>("Category", CategorySchema);
