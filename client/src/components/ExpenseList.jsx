const ExpenseList = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <h3>Recent expenses</h3>
        <p className="empty-state">No expenses yet. Add your first one to get started.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 10 }}>Recent expenses</h3>
      <div>
        {expenses.map((e) => (
          <div className="expense-row" key={e._id}>
            <div>
              <div style={{ fontWeight: 500 }}>{e.title}</div>
              <div style={{ fontSize: "0.75rem", color: "#8b8a80" }}>
                {new Date(e.date).toLocaleDateString()}
                {e.categorySource === "ai" && " · suggested by AI"}
              </div>
            </div>
            <span className="category-tag">{e.category}</span>
            <span className="mono" style={{ fontWeight: 600 }}>
              ₹{e.amount.toFixed(2)}
            </span>
            <button className="delete-btn" onClick={() => onDelete(e._id)} title="Delete expense">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
