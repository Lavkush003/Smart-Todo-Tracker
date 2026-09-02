import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set default auth header if token exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // We can't easily mutate the imported api instance's defaults if it's not exported cleanly,
      // but we assume requests will pick it up or we pass it explicitly.
      // Wait, let's just use localStorage in the interceptor or service.
      setUser({ name: 'User' }); // Mock user info since we don't have a /me endpoint
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (userData, jwt) => {
    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
