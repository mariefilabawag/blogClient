import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        logout();
        await Swal.fire({
          icon: 'success',
          title: 'Logged out successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/');
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Logout failed',
          text: 'Please try again.'
        });
      }
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Logging out...</span>
      </div>
      <p className="mt-3">Logging out...</p>
    </div>
  );
}
