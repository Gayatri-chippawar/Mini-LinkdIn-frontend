// src/App.jsx
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';

// Simple protected wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Basic Navbar
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
   <nav className="navbar navbar-expand-lg bg-light mb-4 py-3 shadow-sm rounded-bottom">
  <div className="container">
    <Link className="navbar-brand fw-bold fs-4 text-primary" to="/">Community</Link>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
      <span className="navbar-toggler-icon" />
    </button>

    <div className="collapse navbar-collapse" id="navMenu">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link fw-semibold" to="/">Home</Link>
        </li>
        {user && (
          <li className="nav-item">
            <Link className="nav-link fw-semibold" to={`/profile/${user._id}`}>My Profile</Link>
          </li>
        )}
      </ul>

      <div className="d-flex align-items-center">
        {user ? (
          <>
            <span className="me-2 text-secondary">Hi, {user.name}</span>
            <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-primary me-2 btn-sm rounded-pill" to="/login">Login</Link>
            <Link className="btn btn-primary btn-sm rounded-pill" to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  </div>
</nav>


  );
};

function AppWrapper() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '1rem auto', padding: '0 16px' }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create"element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}
