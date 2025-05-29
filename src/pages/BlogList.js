import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Attempting to fetch all blogs for BlogList...');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/`);
        console.log('Blogs fetched successfully:', response.data);
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch blogs for BlogList:', err);
        setError('Failed to fetch blogs. Please try again later.');
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
    <div className="blog-list container mt-4 mb-5">
      <h1 className="text-center mb-4 page-title">
        <i className="bi bi-cpu me-2"></i>
        Tech Insights
      </h1>
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
      {blogs.length === 0 && (
        <div className="text-center my-5">
          <i className="bi bi-journal-text display-1 text-muted"></i>
          <p className="mt-3">No blog posts found.</p>
        </div>
      )}
    </div>
  );
}

