import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', fontSize: 14, color: '#666' }}>
      Verifying session...
    </div>
  );
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
