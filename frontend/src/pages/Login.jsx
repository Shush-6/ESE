// src/pages/Login.jsx — Q6: Login & Authentication
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      // Q6 test: invalid password → Unauthorized error
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🏢</div>
        <h1 style={styles.title}>Employee Analytics</h1>
        <p style={styles.sub}>Sign in to your HR dashboard</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="hr@company.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button style={styles.btn(loading)} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchLink}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'hr' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🏢</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.sub}>Register as HR or Admin</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Aman Verma' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'aman@company.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: 'Min 6 characters' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                style={styles.input}
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <select style={styles.input} name="role" value={form.role} onChange={handleChange}>
              <option value="hr">HR Manager</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <button style={styles.btn(loading)} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchLink}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '24px',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '40px', width: '100%',
    maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  logo: { fontSize: '40px', textAlign: 'center', marginBottom: '12px' },
  title: { fontSize: '24px', fontWeight: 800, textAlign: 'center', color: '#1a1a2e', marginBottom: '4px' },
  sub: { color: '#888', textAlign: 'center', marginBottom: '24px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#555' },
  input: {
    padding: '12px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
  },
  btn: (disabled) => ({
    padding: '13px', background: disabled ? '#aaa' : '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '15px', marginTop: '4px',
  }),
  error: {
    background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px',
    fontSize: '13px', marginBottom: '8px',
  },
  switchLink: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888' },
};
