import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function FeaturedPosts() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/`);
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch featured blogs. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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
    <section className="featured-posts py-5">
      <h2 className="text-center mb-4">Featured Posts</h2>
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {blogs.slice(0, 3).map(blog => (
            <div key={blog._id} className="col">
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
                      <i className="bi bi-person me-1"></i>
                      {blog.author?.email || 'Anonymous'}
                    </small>
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
      </div>
      <div className="text-center mt-4">
        <Link to="/blogs" className="btn btn-outline-primary">
          View All Posts
        </Link>
      </div>
    </section>
  );
} 