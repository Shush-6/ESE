// src/pages/AIRecommendations.jsx — Q1: AI Recommendation Display Page | Q5: AI Integration
import { useState, useEffect } from 'react';
import { employeeAPI, aiAPI } from '../api/axiosInstance';

const scoreColor = (score) => {
  if (score >= 85) return '#059669';
  if (score >= 70) return '#d97706';
  return '#dc2626';
};

const AIRecommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rankLoading, setRankLoading] = useState(false);
  const [error, setError] = useState('');
  const [dept, setDept] = useState('');

  useEffect(() => {
    employeeAPI.getAll({ limit: 100 }).then((res) => setEmployees(res.data.data)).catch(() => {});
  }, []);

  // Q5: Get individual AI recommendation
  const handleRecommend = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    setRecommendation(null);
    try {
      const { data } = await aiAPI.recommend(selected);
      setRecommendation(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI recommendation failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  // Q5: Rank multiple employees
  const handleRank = async () => {
    setRankLoading(true);
    setError('');
    setRanking(null);
    try {
      const { data } = await aiAPI.rank({ department: dept || undefined, limit: 5 });
      setRanking(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI ranking failed. Check your API key.');
    } finally {
      setRankLoading(false);
    }
  };

  // Format markdown-like text to HTML paragraphs
  const formatAI = (text) => {
    if (!text) return null;
    return text.split('\n').filter(Boolean).map((line, i) => {
      const isBold = line.startsWith('**') || /^\d+\./.test(line);
      return (
        <p key={i} style={{ margin: '6px 0', fontWeight: isBold ? 600 : 400, color: isBold ? '#1a1a2e' : '#444' }}>
          {line.replace(/\*\*/g, '')}
        </p>
      );
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a2e', marginBottom: '8px' }}>
        🤖 AI Recommendations
      </h1>
      <p style={{ color: '#888', marginBottom: '28px' }}>
        Powered by OpenRouter AI — promotion, training & feedback insights
      </p>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Individual Recommendation ─────────────────────────────────── */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🎯 Individual Recommendation</h2>
        <p style={styles.cardSub}>Select an employee to get AI-powered HR insights</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select
            style={styles.select}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">— Select Employee —</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name} | {e.department} | Score: {e.performanceScore}
              </option>
            ))}
          </select>
          <button
            style={styles.btn(loading || !selected, '#4f46e5')}
            onClick={handleRecommend}
            disabled={loading || !selected}
          >
            {loading ? '⏳ Analyzing...' : '✨ Get AI Recommendation'}
          </button>
        </div>

        {/* Recommendation Result */}
        {recommendation && (
          <div style={styles.result}>
            <div style={styles.empHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{recommendation.employee.name}</h3>
                <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>
                  {recommendation.employee.department} •{' '}
                  <span style={{ color: scoreColor(recommendation.employee.performanceScore), fontWeight: 700 }}>
                    Score: {recommendation.employee.performanceScore}
                  </span>{' '}
                  • {recommendation.employee.performanceCategory}
                </p>
              </div>
              <div style={styles.dateTag}>
                {new Date(recommendation.generatedAt).toLocaleDateString()}
              </div>
            </div>

            <div style={styles.aiOutput}>
              <div style={styles.aiLabel}>🤖 AI Analysis</div>
              <div style={{ lineHeight: 1.7 }}>{formatAI(recommendation.recommendation)}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Employee Ranking ──────────────────────────────────────────── */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🏆 AI Employee Ranking</h2>
        <p style={styles.cardSub}>Rank top 5 employees with comparative AI analysis</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select
            style={styles.select}
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {['Development', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button
            style={styles.btn(rankLoading, '#059669')}
            onClick={handleRank}
            disabled={rankLoading}
          >
            {rankLoading ? '⏳ Ranking...' : '📊 Rank Employees'}
          </button>
        </div>

        {ranking && (
          <div>
            {/* Employee scores table */}
            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {ranking.employees.map((emp, i) => (
                <div key={emp.id} style={styles.rankCard(i)}>
                  <div style={styles.rankNum}>#{i + 1}</div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{emp.name}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{emp.department}</div>
                  <div style={{ fontWeight: 700, color: scoreColor(emp.performanceScore), fontSize: '18px', marginTop: '4px' }}>
                    {emp.performanceScore}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.aiOutput}>
              <div style={styles.aiLabel}>🤖 AI Comparative Analysis</div>
              <div style={{ lineHeight: 1.7 }}>{formatAI(ranking.aiRanking)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff', borderRadius: '12px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  cardTitle: { fontSize: '18px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' },
  cardSub: { color: '#888', fontSize: '14px', marginBottom: '16px' },
  select: {
    flex: 1, minWidth: '220px', padding: '10px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff',
  },
  btn: (disabled, color) => ({
    padding: '10px 20px', background: disabled ? '#aaa' : color, color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px', whiteSpace: 'nowrap',
  }),
  result: {
    background: '#f8f9fa', borderRadius: '10px', padding: '20px',
    border: '1.5px solid #e0e0e0',
  },
  empHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '16px', flexWrap: 'wrap', gap: '8px',
  },
  dateTag: {
    fontSize: '12px', color: '#888', background: '#e0e0e0', padding: '4px 10px',
    borderRadius: '999px', alignSelf: 'flex-start',
  },
  aiOutput: {
    background: '#fff', borderRadius: '8px', padding: '16px',
    border: '1.5px solid #c7d2fe',
  },
  aiLabel: { fontSize: '12px', fontWeight: 700, color: '#4f46e5', marginBottom: '10px', letterSpacing: '0.5px' },
  rankCard: (i) => ({
    flex: '1 1 120px', background: i === 0 ? '#fef3c7' : '#f8f9fa',
    border: `1.5px solid ${i === 0 ? '#d97706' : '#e0e0e0'}`,
    borderRadius: '10px', padding: '12px', textAlign: 'center',
  }),
  rankNum: { fontSize: '22px', marginBottom: '4px' },
};

export default AIRecommendations;
