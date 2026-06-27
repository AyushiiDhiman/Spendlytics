import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#10131a", "#e8b95b", "#ff6b5e", "#7fb787", "#8b8a80", "#c9c4b3"];

const ExpenseChart = ({ byCategory, byMonth }) => {
  const categoryData = Object.entries(byCategory || {}).map(([name, value]) => ({ name, value }));
  const monthData = Object.entries(byMonth || {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => ({ month, total }));

  return (
    <div className="card">
      <h3 style={{ marginBottom: 16 }}>Spending breakdown</h3>
      {categoryData.length === 0 ? (
        <p className="empty-state">Charts will appear once you log some expenses.</p>
      ) : (
        <>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ height: 160, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,27,24,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `₹${v.toFixed(2)}`} />
                <Bar dataKey="total" fill="#10131a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseChart;
