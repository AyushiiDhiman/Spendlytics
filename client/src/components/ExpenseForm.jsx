import { useState } from "react";
import { expenseAPI, aiAPI } from "../services/api";

const CATEGORIES = ["Travel", "Food", "Shopping", "Bills", "Entertainment", "Others"];

const ExpenseForm = ({ onAdded }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Others");
  const [categorySource, setCategorySource] = useState("manual");
  const [notes, setNotes] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSuggestCategory = async () => {
    if (!title) return;
    setSuggesting(true);
    try {
      const { data } = await aiAPI.categorize({ title, notes });
      setCategory(data.category);
      setCategorySource("ai");
    } catch {
      // silently ignore — manual category selection still works
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title || !amount) {
      setError("Title and amount are required.");
      return;
    }
    setSubmitting(true);
    try {
      await expenseAPI.add({ title, amount: Number(amount), category, categorySource, notes });
      setTitle("");
      setAmount("");
      setCategory("Others");
      setCategorySource("manual");
      setNotes("");
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add expense.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: 16 }}>Add an expense</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label className="field-label">Title</label>
          <input
            type="text"
            placeholder="e.g. Swiggy dinner"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="field-label">Amount (₹)</label>
            <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="field-label">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCategorySource("manual");
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="field-label">Notes (optional)</label>
          <input type="text" placeholder="Anything to remember this by" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {error && <span className="error-text">{error}</span>}
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add expense"}
          </button>
          <button
            type="button"
            className="btn-ghost"
            style={{ color: "#1c1b18", borderColor: "rgba(28,27,24,0.2)" }}
            onClick={handleSuggestCategory}
            disabled={!title || suggesting}
          >
            {suggesting ? "Thinking..." : "✨ AI: suggest category"}
          </button>
        </div>
        {categorySource === "ai" && <span style={{ fontSize: "0.78rem", color: "#7a6a3a" }}>Category suggested by AI — change it anytime above.</span>}
      </form>
    </div>
  );
};

export default ExpenseForm;
