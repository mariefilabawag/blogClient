import React from 'react';
import { Link } from 'react-router-dom';

export default function Banner() {
  return (
    <section className="hero-section text-center py-5">
      <h1 className="display-4 fw-bold mb-4">
        <i className="bi bi-cpu me-2"></i>
        Welcome to The Noob Feeds
      </h1>
      <p className="lead mb-4">
        For noobs, by a noob who gets it.
      </p>
      <div className="d-flex justify-content-center align-items-center">
        <Link to="/register" className="btn btn-primary btn-lg me-3">
          Join Now
        </Link>
        <Link to="/login" className="btn btn-primary btn-lg">
          Sign In
        </Link>
      </div>
    </section>
  );
} 