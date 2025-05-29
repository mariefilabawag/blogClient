import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogDetails from './pages/BlogDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import AppNavbar from './components/Navbar';
import BlogList from './pages/BlogList';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import './App.css';

export default function App() {
 
  return (
    <div>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
      </Routes>
    </div>
  );
}
