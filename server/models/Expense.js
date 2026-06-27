import mongoose from "mongoose";

const CATEGORIES = ["Travel", "Food", "Shopping", "Bills", "Entertainment", "Others"];

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, enum: CATEGORIES, default: "Others" },
    categorySource: { type: String, enum: ["manual", "ai"], default: "manual" },
    notes: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

expenseSchema.statics.CATEGORIES = CATEGORIES;

export default mongoose.model("Expense", expenseSchema);
