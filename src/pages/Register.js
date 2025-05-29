import { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  useEffect(() => {
      setPasswordsMatch(password === confirmPassword && confirmPassword !== '');
  }, [password, confirmPassword]);

  useEffect(() => {
      setAllFieldsFilled(
          email !== '' &&
          password !== '' &&
          confirmPassword !== ''
      );
  }, [email, password, confirmPassword]);

  function registerUser(e) {
      e.preventDefault();

      if (!allFieldsFilled) {
           Swal.fire({
              title: 'Error',
              icon: 'error',
              text: 'Please fill in all fields.'
          });
          return;
      }

      if (!passwordsMatch) {
           Swal.fire({
              title: 'Error',
              icon: 'error',
              text: 'Passwords do not match.'
          });
          return;
      }

      setLoading(true);

      axios.post(`${process.env.REACT_APP_API_URL}/users/register`, {
          email: email,
          password: password
      })
      .then(response => {
          console.log(response);
          if (response.data.message === 'Registered Successfully.') {
              Swal.fire({
                  title: 'Registration Successful',
                  icon: 'success',
                  text: 'Welcome to AI Insights! Please login.'
              });
              navigate('/login');
          } else if (response.data.message === 'Email already registered.') {
               Swal.fire({
                  title: 'Registration Failed',
                  icon: 'error',
                  text: 'Email already exists.'
              });
          }
          else {
              Swal.fire({
                  title: 'Something Went Wrong',
                  icon: 'error',
                  text: 'Please try again.'
              });
          }
      })
      .catch(error => {
          console.error("Registration error:", error);
          if (
              error.response &&
              error.response.status === 409 &&
              error.response.data &&
              error.response.data.message === 'Email already registered.'
          ) {
              Swal.fire({
                  title: 'Registration Failed',
                  icon: 'error',
                  text: 'Email already exists.'
              });
          } else {
              Swal.fire({
                  title: 'Registration Failed',
                  icon: 'error',
                  text: 'An error occurred during registration. Please try again.'
              });
          }
      })
      .finally(() => {
          setLoading(false);
      });
  }

  if (user && user.id) {
      return <Navigate to="/dashboard" />;
  }
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5 form-container">
          <h2 className="text-center mb-4">
            <i className="bi bi-person-plus me-2"></i>
            Register
          </h2>
          <form onSubmit={registerUser}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </>
              )}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

