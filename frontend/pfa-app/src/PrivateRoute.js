// PrivateRoute.js
import { getCurrentUser } from '../services/authService';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRoles }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Utilisation
<Route 
  path="/admin" 
  element={
    <PrivateRoute requiredRoles={['Admin']}>
      <AdminDashboard />
    </PrivateRoute>
  } 
/>