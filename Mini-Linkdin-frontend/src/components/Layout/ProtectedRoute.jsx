// inside App.jsx or wherever ProtectedRoute is defined
const ProtectedRoute = ({ children }) => {
  const { user, loading, authenticating } = useContext(AuthContext);
  if (loading || authenticating) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
