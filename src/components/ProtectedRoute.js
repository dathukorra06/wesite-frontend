import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to access this page');
      navigate('/login');
    }
  }, [navigate]);

  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  return children;
};

export default ProtectedRoute;