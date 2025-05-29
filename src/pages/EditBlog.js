import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAuthenticated = user && user.token;
  const isAdmin = user?.isAdmin;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('EditBlog useEffect triggered.');
    console.log('Blog ID from params:', id);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user object:', user);
    console.log('isAdmin:', isAdmin);

    const fetchBlog = async () => {
      try {
        console.log('Fetching blog for editing...');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/${id}`);
        const blog = response.data;
        console.log('Fetched blog data:', blog);

        console.log('Blog author ID from fetched data:', blog.author?._id);
        console.log('Current user ID from context (user.id):', user?.id);
        console.log('Comparing user.id with blog.author._id:', user?.id === blog.author?._id);

        if (!isAuthenticated || (!isAdmin && user?.id !== blog.author?._id)) {
          console.log('User is not authorized to edit this blog.');
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'You are not authorized to edit this blog post.',
            showConfirmButton: true
          }).then(() => {
            navigate('/dashboard');
          });
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to fetch blog post. Please try again later.');
        setLoading(false);
      }
    };

    if (id && user !== undefined) {
      fetchBlog();
    } else if (!isAuthenticated) {
    } else if (user === undefined) {
      console.log('User object is still undefined, waiting for context...');
    }
  }, [id, isAuthenticated, user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/blogs/${id}`,
        { 
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Blog post updated!',
        showConfirmButton: false,
        timer: 1500
      });

      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error('Error updating blog:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to update blog post',
        text: err.response?.data?.message || 'Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  if (!title || !content) {
    return null;
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 form-container">
          <h2 className="text-center mb-4">
            <i className="bi bi-pencil-square me-2"></i>
            Edit Blog Post
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

            {/* Removed Featured Image field */}
            {/*
            {isAdmin && (
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Featured Image</label>
                <input
                  className="form-control"
                  type="file"
                  id="image"
                  accept="image/*"
                />
              </div>
            )}
            */}

            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>
                    Save Changes
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/blogs/${id}`)}
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