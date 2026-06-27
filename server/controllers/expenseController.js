import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch expenses", error: error.message });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, categorySource, notes, date } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({ message: "Title and amount are required" });
    }
    if (Number(amount) < 0) {
      return res.status(400).json({ message: "Amount cannot be negative" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category: category || "Others",
      categorySource: categorySource || "manual",
      notes,
      date: date || Date.now(),
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Could not add expense", error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.deleteOne();
    res.json({ message: "Expense deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Could not delete expense", error: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    const byCategory = {};
    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    }

    const byMonth = {};
    for (const e of expenses) {
      const key = new Date(e.date).toISOString().slice(0, 7); // YYYY-MM
      byMonth[key] = (byMonth[key] || 0) + e.amount;
    }

    res.json({
      totalAmount,
      totalCount: expenses.length,
      byCategory,
      byMonth,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not compute summary", error: error.message });
  }
};
