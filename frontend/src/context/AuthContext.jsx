import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getToken,
  loginGoogle as apiLoginGoogle,
  loginGithub as apiLoginGithub,
} from '../api/auth.js';
import {
  getCurrentUser,
  updateProfile as apiUpdateProfile,
  deleteAccount as apiDeleteAccount,
} from '../api/user.js';
import {
  getNotificationSettings,
  updateNotificationSettings as apiUpdateNotificationSettings,
  getPreferences,
  updatePreferences as apiUpdatePreferences,
} from '../api/settings.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [preferences, setPreferences] = useState(null);

  const fetchUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData.user || userData);
    } catch (err) {
      console.error('Failed to fetch current user profile:', err);
      // If token expired or invalid, clear local session
      if (err.status === 401) {
        localStorage.removeItem('token');
        setTokenState(null);
        setUser(null);
      }
    }

    try {
      const notifData = await getNotificationSettings();
      setNotificationSettings(notifData.settings || notifData.data || notifData);
    } catch (err) {
      console.warn('Could not load notification settings:', err.message);
    }

    try {
      const prefData = await getPreferences();
      setPreferences(prefData.preferences || prefData.data || prefData);
    } catch (err) {
      console.warn('Could not load user preferences:', err.message);
    }
  };

  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setTokenState(savedToken);
      fetchUserData().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      setUser(response.user);
      setTokenState(response.token);
      toast.success('Successfully logged in!');
      await fetchUserData();
      navigate('/dashboard');
      return true;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await apiSignup(name, email, password);
      setUser(response.user);
      setTokenState(response.token);
      toast.success('Account created successfully!');
      await fetchUserData();
      navigate('/dashboard');
      return true;
    } catch (err) {
      toast.error(err.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    setLoading(true);
    try {
      const response = await apiLoginGoogle(idToken);
      setUser(response.user);
      setTokenState(response.token);
      toast.success('Logged in with Google!');
      await fetchUserData();
      navigate('/dashboard');
      return true;
    } catch (err) {
      toast.error(err.message || 'Google login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const githubLogin = async (accessToken) => {
    setLoading(true);
    try {
      const response = await apiLoginGithub(accessToken);
      setUser(response.user);
      setTokenState(response.token);
      toast.success('Logged in with GitHub!');
      await fetchUserData();
      navigate('/dashboard');
      return true;
    } catch (err) {
      toast.error(err.message || 'GitHub login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setTokenState(null);
      setNotificationSettings(null);
      setPreferences(null);
      toast.success('Signed out');
      setLoading(false);
      navigate('/login');
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updated = await apiUpdateProfile(profileData);
      setUser(updated.user || updated);
      toast.success('Profile updated');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      return false;
    }
  };

  const updateNotifications = async (settingsData) => {
    try {
      const updated = await apiUpdateNotificationSettings(settingsData);
      setNotificationSettings(updated.settings || updated.data || updated);
      toast.success('Notification settings saved');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to update notification settings');
      return false;
    }
  };

  const updateUserPreferences = async (prefData) => {
    try {
      const updated = await apiUpdatePreferences(prefData);
      setPreferences(updated.preferences || updated.data || updated);
      toast.success('Preferences saved');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to update preferences');
      return false;
    }
  };

  const deleteUserAccount = async () => {
    try {
      await apiDeleteAccount();
      localStorage.removeItem('token');
      setUser(null);
      setTokenState(null);
      toast.success('Account deleted');
      navigate('/');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete account');
      return false;
    }
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    notificationSettings,
    preferences,
    login,
    signup,
    logout,
    googleLogin,
    githubLogin,
    updateUserProfile,
    updateNotifications,
    updateUserPreferences,
    deleteUserAccount,
    fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
