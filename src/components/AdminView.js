import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

export default function AdminView() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAuthenticated = user && user.token;
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      Swal.fire({
        icon: 'warning',
        title: 'Authorization Required',
        text: 'You must be an admin to view this page.',
        showConfirmButton: true
      }).then(() => {
        navigate('/');
      });
      return;
    }

    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/blogs/`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, [isAuthenticated, isAdmin, navigate, user]);

  const handleDeleteBlog = async (blogId) => {
    const result = await Swal.fire({
      title: 'Delete Blog Post?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/blogs/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        setBlogs(blogs.filter(blog => blog._id !== blogId));
        Swal.fire('Deleted!', 'The blog post has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete blog post.', 'error');
      }
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

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

  return (
    <div className="container admin-dashboard-container">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="bi bi-shield-lock me-2"></i>
            Admin Dashboard
          </h2>

          {/* All Blogs Section */}
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="h5 mb-0">
                <i className="bi bi-journal-text me-2"></i>
                All Blog Posts
              </h3>
            </div>
            <div className="card-body">
              {/* Replacing table with card layout */}
              {blogs.length > 0 ? (
                <div className="row row-cols-1 g-4">
                  {blogs.map(blog => (
                    <div key={blog._id} className="col-12">
                      <div className="card h-100 blog-card">
                        <div className="card-body">
                          {/* Container for Title and Action Buttons */}
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0">
                              <Link to={`/blogs/${blog._id}`} className="text-decoration-none">
                                {blog.title}
                              </Link>
                            </h5>
                            {/* Action buttons */}
                            <div className="btn-group flex-shrink-0">
                              <Link
                                to={`/edit-blog/${blog._id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                onClick={() => handleDeleteBlog(blog._id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                          {/* Author and Date */}
                          <div className="d-flex justify-content-between align-items-center">
                             {/* Author */}
                            <small className="text-muted">
                              <i className="bi bi-person me-1"></i>
                              {blog.author?.email || 'Anonymous'}
                            </small>
                             {/* Date */}
                            <small className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center my-5">
                  <i className="bi bi-journal-text display-1 text-muted"></i>
                  <p className="mt-3">No blog posts found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}