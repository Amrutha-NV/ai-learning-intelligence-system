import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getAnalyticsOverview, getAnalyticsDistribution } from '../api/analytics.js';

const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children }) => {
  const [overview, setOverview] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, distRes] = await Promise.all([
        getAnalyticsOverview().catch(err => {
          console.warn('Overview analytics error:', err);
          return null;
        }),
        getAnalyticsDistribution().catch(err => {
          console.warn('Distribution analytics error:', err);
          return [];
        }),
      ]);

      const overviewData = overviewRes?.overview || overviewRes?.data || overviewRes;
      const distData = Array.isArray(distRes) ? distRes : distRes?.distribution || distRes?.data || [];

      setOverview(overviewData);
      setDistribution(distData);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    overview,
    distribution,
    loading,
    error,
    fetchAnalytics,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
