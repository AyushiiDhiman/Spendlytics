import { useState } from "react";
import { aiAPI } from "../services/api";

const AIInsights = () => {
  const [insight, setInsight] = useState("");
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsight = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await aiAPI.insights();
      setInsight(data.insight);
      setSource(data.source);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate insight right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="insight-card">
      <div className="insight-label">AI Insight</div>
      {insight ? (
        <p style={{ margin: 0, lineHeight: 1.5 }}>{insight}</p>
      ) : (
        <p style={{ margin: 0, color: "#a9a89d" }}>Generate a quick read on your spending patterns.</p>
      )}
      {error && <p className="error-text" style={{ marginTop: 8 }}>{error}</p>}
      <button className="btn-ghost" style={{ marginTop: 14 }} onClick={fetchInsight} disabled={loading}>
        {loading ? "Analyzing..." : insight ? "Refresh insight" : "Generate insight"}
      </button>
      {source === "fallback" && (
        <p style={{ marginTop: 8, fontSize: "0.72rem", color: "#8b8a80" }}>
          Running on rule-based fallback — add an OPENAI_API_KEY on the server for richer AI insights.
        </p>
      )}
    </div>
  );
};

export default AIInsights;
