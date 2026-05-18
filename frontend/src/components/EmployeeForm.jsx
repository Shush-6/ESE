// src/components/EmployeeForm.jsx — Q1: Employee Registration Form
// Features: useState, form handling, API integration, responsive UI
import { useState } from 'react';
import { employeeAPI } from '../api/axiosInstance';

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Management'];

const initialForm = {
  name: '',
  email: '',
  department: '',
  skills: '',
  performanceScore: '',
  experience: '',
  designation: '',
};

const EmployeeForm = ({ onSuccess, editData = null }) => {
  // Q1: useState for form data
  const [form, setForm] = useState(editData ? {
    ...editData,
    skills: editData.skills?.join(', ') || '',
  } : initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Q1: Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Parse skills array from comma-separated string
    const payload = {
      ...form,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      performanceScore: Number(form.performanceScore),
      experience: Number(form.experience),
    };

    try {
      if (editData) {
        await employeeAPI.update(editData._id, payload);
        setSuccess('Employee updated successfully!');
      } else {
        await employeeAPI.add(payload);
        setSuccess('Employee added successfully!');
        setForm(initialForm);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{editData ? '✏️ Edit Employee' : '➕ Add New Employee'}</h2>

      {error && <div style={styles.alert('error')}>{error}</div>}
      {success && <div style={styles.alert('success')}>{success}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          {/* Name */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name *</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Aman Verma"
              required
            />
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email *</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="aman@gmail.com"
              required
            />
          </div>

          {/* Department */}
          <div style={styles.field}>
            <label style={styles.label}>Department *</label>
            <select
              style={styles.input}
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Designation */}
          <div style={styles.field}>
            <label style={styles.label}>Designation</label>
            <input
              style={styles.input}
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="e.g. Senior Developer"
            />
          </div>

          {/* Performance Score */}
          <div style={styles.field}>
            <label style={styles.label}>Performance Score (0-100) *</label>
            <input
              style={styles.input}
              type="number"
              name="performanceScore"
              value={form.performanceScore}
              onChange={handleChange}
              placeholder="85"
              min="0"
              max="100"
              required
            />
          </div>

          {/* Experience */}
          <div style={styles.field}>
            <label style={styles.label}>Years of Experience *</label>
            <input
              style={styles.input}
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="3"
              min="0"
              max="50"
              required
            />
          </div>
        </div>

        {/* Skills - full width */}
        <div style={styles.field}>
          <label style={styles.label}>Skills * (comma-separated)</label>
          <input
            style={styles.input}
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, Express"
            required
          />
        </div>

        <button style={styles.btn(loading)} type="submit" disabled={loading}>
          {loading ? 'Saving...' : editData ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  title: { fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#1a1a2e' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#555' },
  input: {
    padding: '10px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  btn: (disabled) => ({
    padding: '12px 24px',
    background: disabled ? '#aaa' : '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s',
    alignSelf: 'flex-start',
    marginTop: '4px',
  }),
  alert: (type) => ({
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    background: type === 'error' ? '#fee2e2' : '#d1fae5',
    color: type === 'error' ? '#991b1b' : '#065f46',
    fontSize: '14px',
    fontWeight: 500,
  }),
};

export default EmployeeForm;
