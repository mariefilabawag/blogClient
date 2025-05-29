import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const isAuthenticated = user && user.token;
  const isAdmin = user?.isAdmin;

  if (!isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Required',
      text: 'Please login to view your dashboard.',
      showConfirmButton: true
    }).then(() => {
      navigate('/login');
    });
    return null;
  }

  return (
    <div className="container mt-4">
      {!isAdmin && <UserView />}
      {isAdmin && <AdminView />}
    </div>
  );
} 