// src/pages/Analytics.jsx — Employee Analytics & Rankings Dashboard
import { useState, useEffect } from 'react';
import { employeeAPI } from '../api/axiosInstance';

const scoreColor = (score) => {
  if (score >= 85) return '#059669';
  if (score >= 70) return '#d97706';
  if (score >= 50) return '#7c3aed';
  return '#dc2626';
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await employeeAPI.getAnalytics();
        setData(res.data.data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div style={styles.center}>Loading analytics...</div>;
  if (error) return <div style={styles.center}>{error}</div>;
  if (!data) return null;

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a2e', marginBottom: '24px' }}>
        📊 Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard('#4f46e5')}>
          <div style={styles.statNum}>{data.totalEmployees}</div>
          <div style={styles.statLabel}>Total Employees</div>
        </div>
        <div style={styles.statCard('#059669')}>
          <div style={styles.statNum}>{data.averagePerformanceScore}</div>
          <div style={styles.statLabel}>Avg. Performance Score</div>
        </div>
        <div style={styles.statCard('#d97706')}>
          <div style={styles.statNum}>{data.departmentStats.length}</div>
          <div style={styles.statLabel}>Departments</div>
        </div>
        <div style={styles.statCard('#dc2626')}>
          <div style={styles.statNum}>{data.topPerformers.length}</div>
          <div style={styles.statLabel}>Top Performers</div>
        </div>
      </div>

      <div style={styles.row}>
        {/* Department Stats */}
        <div style={{ ...styles.card, flex: 1.2 }}>
          <h2 style={styles.cardTitle}>🏢 Department Breakdown</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr>
                {['Department', 'Employees', 'Avg Score', 'Avg Exp.'].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.departmentStats.map((d, i) => (
                <tr key={d._id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={styles.td}>
                    <span style={styles.badge}>{d._id}</span>
                  </td>
                  <td style={styles.td}>{d.count}</td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: 700, color: scoreColor(d.avgScore) }}>
                      {d.avgScore.toFixed(1)}
                    </span>
                  </td>
                  <td style={styles.td}>{d.avgExperience.toFixed(1)}yr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Performers */}
        <div style={{ ...styles.card, flex: 0.8 }}>
          <h2 style={styles.cardTitle}>🏆 Top 5 Performers</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.topPerformers.map((emp, i) => (
              <div key={emp._id} style={styles.performerRow}>
                <div style={styles.rank(i)}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{emp.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{emp.department} • {emp.experience}yr exp.</div>
                </div>
                <div style={{ fontWeight: 800, color: scoreColor(emp.performanceScore), fontSize: '18px' }}>
                  {emp.performanceScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  center: { textAlign: 'center', padding: '60px', color: '#888' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: (color) => ({
    background: color, color: '#fff', borderRadius: '12px', padding: '24px',
    boxShadow: '0 4px 12px ' + color + '44',
  }),
  statNum: { fontSize: '36px', fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: '13px', opacity: 0.85, marginTop: '6px' },
  row: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  card: {
    background: '#fff', borderRadius: '12px', padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: '280px',
  },
  cardTitle: { fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '16px' },
  th: { padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#555', borderBottom: '2px solid #f0f0f0', fontSize: '13px' },
  td: { padding: '10px 12px', color: '#444', borderBottom: '1px solid #f0f0f0' },
  badge: {
    padding: '3px 10px', background: '#eef2ff', color: '#4f46e5',
    borderRadius: '999px', fontSize: '12px', fontWeight: 600,
  },
  performerRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px', background: '#fafafa', borderRadius: '8px',
  },
  rank: (i) => ({
    width: '28px', height: '28px', borderRadius: '50%',
    background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : '#e0e0e0',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '12px', flexShrink: 0,
  }),
};

export default Analytics;
