import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAuthenticated = user && user.token;
  const isAdmin = user?.isAdmin;
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const blogResponse = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/${id}`);
        setBlog(blogResponse.data);

        const commentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/comments/blogPost/${id}`);
        setComments(commentsResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog post or comments. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlogAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        { 
          content: comment,
          blogPostId: id,
          author: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      setComments(prevComments => [...prevComments, response.data]);
      setComment('');
      Swal.fire({
        icon: 'success',
        title: 'Comment added successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add comment',
        text: err.response?.data?.message || 'Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
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
          `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );
        setComments(prevComments => prevComments.filter(c => c._id !== commentId));
        Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete comment.', 'error');
      }
    }
  };

  const handleEditCommentClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentContent(comment.content);
  };

  const handleUpdateCommentSubmit = async (commentId) => {
    if (!editingCommentContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        { content: editingCommentContent },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setComments(prevComments =>
        prevComments.map(c =>
          c._id === commentId ? { ...c, content: response.data.content } : c
        )
      );

      setEditingCommentId(null);
      setEditingCommentContent('');

      Swal.fire({
        icon: 'success',
        title: 'Comment updated successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
       Swal.fire({
        icon: 'error',
        title: 'Failed to update comment',
        text: err.response?.data?.message || 'Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleDeleteBlog = async () => {
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
          `${process.env.REACT_APP_API_URL}/blogs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );
        Swal.fire({
          icon: 'success',
          title: 'Blog post deleted!',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/blogs');
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete blog post.', 'error');
      }
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

  if (!blog) {
    return (
      <div className="alert alert-warning" role="alert">
        <i className="bi bi-question-circle-fill me-2"></i>
        Blog post not found.
      </div>
    );
  }

  const canEdit = isAuthenticated && (user?.id === blog.author?._id || isAdmin);
  const canDelete = isAuthenticated && (user?.id === blog.author?._id || isAdmin);

  return (
    <div className="blog-details">
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title">{blog.title}</h1>
          
          <div className="meta-info">
            <div className="author">
              <i className="bi bi-person-circle"></i>
              {blog.author?.email || 'Anonymous'}
            </div>
            <div className="date">
              <i className="bi bi-calendar3"></i>
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="card-text">{blog.content}</div>

          {canEdit && (
            <div className="action-buttons">
              <Link 
                to={`/edit-blog/${blog._id}`}
                className="btn btn-outline-primary"
              >
                <i className="bi bi-pencil me-1"></i>
                Edit Post
              </Link>
              {canDelete && (
                <button 
                  onClick={handleDeleteBlog}
                  className="btn btn-outline-danger"
                >
                  <i className="bi bi-trash me-1"></i>
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="comments-section">
        <h3>
          <i className="bi bi-chat-dots me-2"></i>
          Comments
        </h3>
        
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form mb-4">
            <div className="mb-3">
              <textarea
                className="form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows="3"
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Posting...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-1"></i>
                  Post Comment
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Please <Link to="/login">login</Link> to post comments.
          </div>
        )}

        <div className="comments-list">
          {comments && comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment._id} className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="card-subtitle">
                        <i className="bi bi-person me-1"></i>
                        {comment.author?.email || 'Anonymous'}
                      </h6>
                      {editingCommentId === comment._id ? (
                        <div className="mt-2">
                          <textarea
                            className="form-control mb-2"
                            value={editingCommentContent}
                            onChange={(e) => setEditingCommentContent(e.target.value)}
                            rows="3"
                          ></textarea>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleUpdateCommentSubmit(comment._id)}
                              disabled={submitting}
                            >
                              <i className="bi bi-check-lg me-1"></i>
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={handleCancelEdit}
                              disabled={submitting}
                            >
                              <i className="bi bi-x-lg me-1"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="card-text">{comment.content}</p>
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </small>
                        </>
                      )}
                    </div>
                    {(isAuthenticated && (user?.id === comment.author?._id || isAdmin)) && (
                      <div className="btn-group">
                        {editingCommentId !== comment._id && (
                          <button
                            onClick={() => handleEditCommentClick(comment)}
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Edit comment"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="btn btn-sm btn-outline-danger"
                          disabled={editingCommentId === comment._id}
                          title="Delete comment"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted my-5">
              <i className="bi bi-chat-square-text display-1"></i>
              <p className="mt-3">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
