import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        if (isMounted) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to load user', err);
        if (isMounted) {
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleAuth = async (fn) => {
    setAuthError(null);
    setLoading(true);
    try {
      const data = await fn();
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = (credentials) => handleAuth(() => loginUser(credentials));
  const register = (payload) => handleAuth(() => registerUser(payload));

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      authError,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
    }),
    [user, token, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

