import { useEffect, useState, useCallback } from "react";
import { expenseAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import AIInsights from "../components/AIInsights";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, byCategory: {}, byMonth: {} });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [expensesRes, summaryRes] = await Promise.all([expenseAPI.list(), expenseAPI.summary()]);
    setExpenses(expensesRes.data);
    setSummary(summaryRes.data);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const handleDelete = async (id) => {
    await expenseAPI.remove(id);
    loadData();
  };

  return (
    <div className="app-shell">
      <aside className="ledger">
        <div className="ledger-brand">
  Spend<span>lytics</span>
</div>
        <div className="ledger-total-block">
          <div className="ledger-total-label">Total spent</div>
          <div className="ledger-total-value mono">₹{summary.totalAmount.toFixed(2)}</div>
        </div>
        <div style={{ fontSize: "0.82rem", color: "#a9a89d" }}>
          Signed in as
          <div style={{ color: "#f1eee3", fontWeight: 500, marginTop: 2 }}>{user?.name || user?.email}</div>
        </div>
        <nav className="ledger-nav">
          <button onClick={logout}>Log out →</button>
        </nav>
      </aside>

      <main className="main-area">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <AIInsights />

        <div className="grid-2">
          <ExpenseForm onAdded={loadData} />
          <ExpenseChart byCategory={summary.byCategory} byMonth={summary.byMonth} />
        </div>

        {loading ? (
          <p className="empty-state">Loading your expenses...</p>
        ) : (
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
