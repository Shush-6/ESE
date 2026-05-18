// src/pages/EmployeeList.jsx — Q1: Employee List Page + Search & Filter Section
// Q4: Dynamic data rendering, delete integration
import { useState, useEffect, useCallback } from 'react';
import { employeeAPI } from '../api/axiosInstance';
import EmployeeForm from '../components/EmployeeForm';

const DEPARTMENTS = ['', 'Development', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Management'];

const scoreColor = (score) => {
  if (score >= 85) return '#059669';
  if (score >= 70) return '#d97706';
  if (score >= 50) return '#7c3aed';
  return '#dc2626';
};

const EmployeeList = () => {
  // Q1: useState for data management
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleting, setDeleting] = useState('');

  // Q1: Search & Filter state
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [sortBy, setSortBy] = useState('performanceScore');
  const [total, setTotal] = useState(0);

  // Q1: useEffect for data fetching
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterDept) params.department = filterDept;
      if (sortBy) params.sortBy = sortBy;

      let res;
      if (search) {
        res = await employeeAPI.search({ name: search, department: filterDept || undefined });
      } else {
        res = await employeeAPI.getAll(params);
      }
      setEmployees(res.data.data);
      setTotal(res.data.total || res.data.count);
    } catch (err) {
      setError('Failed to load employees. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [search, filterDept, sortBy]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete employee "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await employeeAPI.delete(id);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting('');
    }
  };

  const handleEdit = (emp) => {
    setEditData(emp);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>👥 Employees</h1>
          <p style={styles.sub}>{total} employees total</p>
        </div>
        <button
          style={styles.primaryBtn}
          onClick={() => { setEditData(null); setShowForm(!showForm); }}
        >
          {showForm ? '✕ Close Form' : '+ Add Employee'}
        </button>
      </div>

      {/* Employee Form (toggle) */}
      {showForm && (
        <EmployeeForm
          editData={editData}
          onSuccess={() => { setShowForm(false); setEditData(null); fetchEmployees(); }}
        />
      )}

      {/* Q1: Search & Filter Section */}
      <div style={styles.filterBar}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={styles.select}
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d || 'All Departments'}</option>
          ))}
        </select>
        <select
          style={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="performanceScore">Sort: Score ↓</option>
          <option value="experience">Sort: Experience ↓</option>
          <option value="createdAt">Sort: Newest First</option>
          <option value="name">Sort: Name A-Z</option>
        </select>
        <button style={styles.refreshBtn} onClick={fetchEmployees}>↻ Refresh</button>
      </div>

      {/* Error */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Loading */}
      {loading && <div style={styles.loading}>Loading employees...</div>}

      {/* Employee Table */}
      {!loading && !error && (
        employees.length === 0 ? (
          <div style={styles.empty}>No employees found. Add your first employee!</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Skills</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Exp.</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp._id} style={styles.tr(idx)}>
                    <td style={styles.td}>{idx + 1}</td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{emp.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{emp.designation}</div>
                    </td>
                    <td style={styles.td}><span style={styles.email}>{emp.email}</span></td>
                    <td style={styles.td}><span style={styles.badge('#4f46e5')}>{emp.department}</span></td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {emp.skills.slice(0, 3).map((s) => (
                          <span key={s} style={styles.badge('#0ea5e9')}>{s}</span>
                        ))}
                        {emp.skills.length > 3 && <span style={styles.badge('#64748b')}>+{emp.skills.length - 3}</span>}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: 700, color: scoreColor(emp.performanceScore) }}>
                        {emp.performanceScore}
                      </span>
                      <div style={{ fontSize: '11px', color: '#888' }}>{emp.performanceCategory}</div>
                    </td>
                    <td style={styles.td}>{emp.experience}yr{emp.experience !== 1 ? 's' : ''}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={styles.editBtn} onClick={() => handleEdit(emp)}>Edit</button>
                        <button
                          style={styles.deleteBtn(deleting === emp._id)}
                          onClick={() => handleDelete(emp._id, emp.name)}
                          disabled={deleting === emp._id}
                        >
                          {deleting === emp._id ? '...' : 'Del'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  h1: { fontSize: '28px', fontWeight: 800, color: '#1a1a2e', margin: 0 },
  sub: { color: '#888', margin: '4px 0 0', fontSize: '14px' },
  primaryBtn: {
    padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none',
    borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px',
  },
  filterBar: {
    display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px',
    background: '#fff', padding: '16px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  searchInput: {
    flex: 1, minWidth: '200px', padding: '10px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', outline: 'none',
  },
  select: {
    padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px',
    fontSize: '14px', outline: 'none', background: '#fff', cursor: 'pointer',
  },
  refreshBtn: {
    padding: '10px 16px', background: '#f3f4f6', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
  },
  errorBox: { background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
  loading: { textAlign: 'center', padding: '40px', color: '#888', fontSize: '16px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '16px', background: '#fff', borderRadius: '12px' },
  tableWrap: { overflowX: 'auto', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  thead: { background: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#444', borderBottom: '2px solid #e0e0e0' },
  tr: (i) => ({ background: i % 2 === 0 ? '#fff' : '#fafafa', transition: 'background 0.15s' }),
  td: { padding: '14px 16px', color: '#444', verticalAlign: 'top', borderBottom: '1px solid #f0f0f0' },
  email: { fontSize: '13px', color: '#6b7280' },
  badge: (color) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: '999px',
    background: color + '18', color, fontSize: '11px', fontWeight: 600,
  }),
  editBtn: {
    padding: '4px 10px', background: '#dbeafe', color: '#1d4ed8', border: 'none',
    borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
  },
  deleteBtn: (dis) => ({
    padding: '4px 10px', background: dis ? '#fee2e2' : '#fee2e2', color: '#dc2626', border: 'none',
    borderRadius: '6px', cursor: dis ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600,
  }),
};

export default EmployeeList;
