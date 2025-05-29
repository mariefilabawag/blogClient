import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAuthenticated = user && user.token;
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please login to create a blog post.',
        showConfirmButton: true
      }).then(() => {
        navigate('/login');
      });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/blogs`,
        { 
          title,
          content,
          author: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      console.log('Created blog:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Blog post created!',
        showConfirmButton: false,
        timer: 1500
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating blog:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to create blog post',
        text: err.response?.data?.message || 'Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 form-container">
          <h2 className="text-center mb-4">
            <i className="bi bi-pencil-square me-2"></i>
            Create New Blog Post
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-type-h1"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter your blog title"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-text-paragraph"></i>
                </span>
                <textarea
                  className="form-control"
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows="10"
                  placeholder="Write your blog content here..."
                ></textarea>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Blog Post
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/dashboard')}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 