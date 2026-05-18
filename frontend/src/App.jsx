// src/App.jsx — Main App with React Router — Q4: MERN Integration
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeList from './pages/EmployeeList';
import Analytics from './pages/Analytics';
import AIRecommendations from './pages/AIRecommendations';
import { Login, Signup } from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 60px)', background: '#f5f6fa' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes — Q6 */}
            <Route path="/" element={
              <ProtectedRoute><EmployeeList /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
            <Route path="/ai" element={
              <ProtectedRoute><AIRecommendations /></ProtectedRoute>
            } />

            {/* 404 fallback */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
                <div style={{ fontSize: '60px' }}>🔍</div>
                <h2>Page Not Found</h2>
              </div>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
