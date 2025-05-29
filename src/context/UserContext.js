import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export default function UserProvider({ children }) {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          token: token,
          id: decodedToken.id,
          email: decodedToken.email,
          isAdmin: decodedToken.isAdmin 
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };