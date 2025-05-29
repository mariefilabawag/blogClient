import { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    function authenticate(e) {
        e.preventDefault();
        setLoading(true);

        axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
            email: email,
            password: password
        })
        .then(response => {
            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
                const decoded = jwtDecode(response.data.access);
                setUser({ ...decoded, token: response.data.access });

                Swal.fire({
                    title: 'Login Successful',
                    icon: 'success',
                    text: 'Welcome back!'
                });

                navigate('/dashboard');
            }
        })
        .catch(error => {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 404 && message === 'No email found') {
                Swal.fire({
                    title: 'Authentication Failed',
                    icon: 'error',
                    text: 'No account found with this email.'
                });
            } else if (status === 401 && message === 'Incorrect email or password') {
                Swal.fire({
                    title: 'Authentication Failed',
                    icon: 'error',
                    text: 'Incorrect email or password.'
                });
            } else if (status === 400 && message === 'Invalid email format') {
                Swal.fire({
                    title: 'Authentication Failed',
                    icon: 'error',
                    text: 'Invalid email format.'
                });
            } else {
                Swal.fire({
                    title: 'Authentication Failed',
                    icon: 'error',
                    text: message || 'An error occurred during login. Please try again.'
                });
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }

    if (user && user.token) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5 form-container">
                    <h2 className="text-center mb-4">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                    </h2>
                    <form onSubmit={authenticate}>
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
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Login
                                </>
                            )}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="mb-0">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-decoration-none">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
