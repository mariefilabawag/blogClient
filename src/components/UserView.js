import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

export default function UserView() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAuthenticated = user && user.token;

  useEffect(() => {
    console.log('UserView useEffect triggered.'); 
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user object:', user);
    console.log('user._id:', user?._id); 

    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting.');
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please login to view your dashboard.',
        showConfirmButton: true
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    if (isAuthenticated && user && user.id) {
      console.log('Authenticated and user.id available, attempting to fetch user blogs.');
      const fetchUserBlogs = async () => {
        try {
          console.log('Fetching all blogs for UserView...'); 
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/blogs/`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            }
          );
          
          console.log('Fetched blogs:', response.data); 
          console.log('Current user ID:', user.id); 

          const userBlogs = response.data.filter(blog => {
            console.log('Blog author ID:', blog.author?._id); 
            console.log('Comparing with user.id:', user.id); 
            return blog.author?._id === user.id; 
          });
          
          console.log('Filtered user blogs:', userBlogs); 
          setBlogs(userBlogs);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching blogs:', err); 
          setError('Failed to fetch your blog posts. Please try again later.');
          setLoading(false);
        }
      };

      fetchUserBlogs();
    }
  }, [isAuthenticated, navigate, user]);

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
        Swal.fire('Deleted!', 'Your blog post has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete blog post.', 'error');
      }
    }
  };

  if (!isAuthenticated) {
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
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="page-title">
              <i className="bi bi-person-circle me-2"></i>
              My Dashboard
            </h2>
            <Link to="/create-blog" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Blog
            </Link>
          </div>

          {blogs.length > 0 ? (
            <div className="row row-cols-1 g-4">
              {blogs.map(blog => (
                <div key={blog._id} className="col-12">
                  <div className="card h-100 blog-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/blogs/${blog._id}`} className="text-decoration-none">
                          {blog.title}
                        </Link>
                      </h5>
                      <p className="card-text text-muted">
                        {blog.content.substring(0, 150)}...
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </small>
                        <div className="btn-group">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center my-5">
              <i className="bi bi-journal-text display-1 text-muted"></i>
              <p className="mt-3">You haven't created any blog posts yet.</p>
              <Link to="/create-blog" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Create Your First Blog
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 