import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function AppNavbar() {
  const { user } = useContext(UserContext);
  const isAuthenticated = user && user.token;
  const isAdmin = user?.isAdmin;

  return (
    <Navbar expand="lg" variant="dark" className="mb-4">
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/blogs/"
          className="navbar-brand"
        >
          <i className="bi bi-cpu me-2"></i>
          The Noob Feeds
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAuthenticated && (
              <Nav.Link as={Link} to="/" className="nav-item nav-link">
                <i className="bi bi-house-door me-1"></i>
                Home
              </Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/create-blog" className="nav-item nav-link">
                <i className="bi bi-plus-circle me-1"></i>
                Create Blog
              </Nav.Link>
            )}
            {isAuthenticated && !isAdmin && (
              <Nav.Link as={Link} to="/dashboard" className="nav-item nav-link">
                <i className="bi bi-person-circle me-1"></i>
                My Dashboard
              </Nav.Link>
            )}
            {isAdmin && (
              <Nav.Link as={Link} to="/dashboard" className="nav-item nav-link">
                <i className="bi bi-shield-lock me-1"></i>
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as="span" className="nav-item nav-link">
                  <i className="bi bi-person me-1"></i>
                  {user?.email}
                </Nav.Link>
                <Nav.Link as={Link} to="/logout" className="nav-item nav-link">
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register" className="nav-item nav-link">
                  <i className="bi bi-person-plus me-1"></i>
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="nav-item nav-link">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
} 