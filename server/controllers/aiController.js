import { GoogleGenerativeAI } from "@google/generative-ai";
import Expense from "../models/Expense.js";

const withRetry = async (fn, retries = 2, delayMs = 1500) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const is503 = error.message?.includes("503") || error.message?.includes("overloaded") || error.message?.includes("high demand");
      if (!is503 || attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
};

const CATEGORIES = ["Travel", "Food", "Shopping", "Bills", "Entertainment", "Others"];

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

// Simple keyword fallback so the feature still works without an API key
const keywordCategorize = (text = "") => {
  const t = text.toLowerCase();
  const rules = [
    { category: "Travel", words: ["flight", "uber", "ola", "train", "taxi", "bus", "cab", "fuel", "petrol", "trip", "hotel"] },
    { category: "Food", words: ["food", "lunch", "dinner", "breakfast", "restaurant", "swiggy", "zomato", "cafe", "coffee", "snack", "grocery"] },
    { category: "Shopping", words: ["amazon", "flipkart", "myntra", "clothes", "shopping", "shoes", "mall", "store"] },
    { category: "Bills", words: ["electricity", "bill", "rent", "wifi", "internet", "recharge", "subscription", "emi", "insurance"] },
    { category: "Entertainment", words: ["movie", "netflix", "spotify", "game", "concert", "party", "outing", "prime video"] },
  ];
  for (const rule of rules) {
    if (rule.words.some((w) => t.includes(w))) return rule.category;
  }
  return "Others";
};

export const categorizeExpense = async (req, res) => {
  try {
    const { title, notes } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required to categorize an expense" });
    }

    const client = getClient();
    if (!client) {
      return res.json({
        category: keywordCategorize(`${title} ${notes || ""}`),
        source: "fallback",
        note: "GEMINI_API_KEY not set — used keyword-based categorization.",
      });
    }

    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: `Classify the expense into exactly one of these categories: ${CATEGORIES.join(
        ", "
      )}. Respond with only the category name, nothing else.`,
    });

    const result = await withRetry(() => model.generateContent(`Title: ${title}\nNotes: ${notes || "none"}`));
    const raw = result.response.text().trim();
    const category = CATEGORIES.includes(raw) ? raw : keywordCategorize(`${title} ${notes || ""}`);

    res.json({ category, source: "ai" });
  } catch (error) {
    // If the AI call fails for any reason, never block the user — fall back gracefully
    const { title, notes } = req.body;
    res.json({
      category: keywordCategorize(`${title} ${notes || ""}`),
      source: "fallback",
      note: "AI categorization failed, used keyword-based fallback.",
    });
  }
};

const buildRuleBasedInsight = ({ totalAmount, byCategory, byMonth }) => {
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];
  const months = Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0]));

  let trendLine = "Not enough monthly data yet to show a trend.";
  if (months.length >= 2) {
    const [, prevTotal] = months[months.length - 2];
    const [, currTotal] = months[months.length - 1];
    const diff = currTotal - prevTotal;
    const pct = prevTotal > 0 ? Math.abs((diff / prevTotal) * 100).toFixed(0) : 0;
    trendLine =
      diff >= 0
        ? `Spending rose by about ${pct}% compared to the previous month.`
        : `Spending dropped by about ${pct}% compared to the previous month.`;
  }

  const topLine = topCategory
    ? `Your biggest spending category is ${topCategory[0]}, making up ₹${topCategory[1].toFixed(
        2
      )} of your total ₹${totalAmount.toFixed(2)}.`
    : "No expenses logged yet.";

  return `${topLine} ${trendLine}`;
};

export const getInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });

    if (expenses.length === 0) {
      return res.json({
        insight: "No expenses logged yet. Add a few expenses to unlock AI insights.",
        source: "fallback",
      });
    }

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = {};
    const byMonth = {};
    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      const key = new Date(e.date).toISOString().slice(0, 7);
      byMonth[key] = (byMonth[key] || 0) + e.amount;
    }

    const client = getClient();
    if (!client) {
      return res.json({
        insight: buildRuleBasedInsight({ totalAmount, byCategory, byMonth }),
        source: "fallback",
      });
    }

    const model = client.getGenerativeModel({
     model: "gemini-2.5-flash-lite",
      systemInstruction:
        "You are a concise personal finance assistant. Given spending data, write a 2-3 sentence, friendly, specific insight. Mention the top spending category and any notable month-to-month trend. Use ₹ for currency. No markdown, no preamble.",
    });

   const result = await withRetry(() =>
  model.generateContent(JSON.stringify({ totalAmount, byCategory, byMonth }))
);

    const insight =
      result.response.text().trim() ||
      buildRuleBasedInsight({ totalAmount, byCategory, byMonth });

    res.json({ insight, source: "ai" });
} catch (error) {
    console.error("AI Insights error:", error.message);
    res.status(500).json({ message: "Could not generate insights", error: error.message });
  }
};
