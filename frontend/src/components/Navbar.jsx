// src/components/Navbar.jsx — Navigation with auth state
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuth } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: '👥 Employees' },
    { to: '/analytics', label: '📊 Analytics' },
    { to: '/ai', label: '🤖 AI Insights' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>🏢 HR Analytics</Link>

        <div style={styles.links}>
          {isAuth && navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={pathname === to ? styles.activeLink : styles.link}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={styles.right}>
          {isAuth ? (
            <>
              <span style={styles.userBadge}>
                {user?.role?.toUpperCase()} • {user?.name}
              </span>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.loginLink}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#1a1a2e', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
    height: '60px', display: 'flex', alignItems: 'center', gap: '32px',
  },
  brand: { color: '#a5b4fc', fontWeight: 800, fontSize: '18px', textDecoration: 'none', whiteSpace: 'nowrap' },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: { color: '#9ca3af', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: 500 },
  activeLink: {
    color: '#fff', textDecoration: 'none', padding: '6px 12px',
    borderRadius: '6px', fontSize: '14px', fontWeight: 600, background: 'rgba(255,255,255,0.1)',
  },
  right: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' },
  userBadge: { fontSize: '12px', color: '#a5b4fc', fontWeight: 600 },
  logoutBtn: {
    padding: '6px 14px', background: 'transparent', color: '#f87171',
    border: '1.5px solid #f87171', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
  },
  loginLink: { color: '#a5b4fc', textDecoration: 'none', fontWeight: 600, fontSize: '14px' },
};

export default Navbar;
