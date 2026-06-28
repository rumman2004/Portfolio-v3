import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook for fetching data using the configured axios instance.
 * @param {string} url - The endpoint to fetch from
 * @param {boolean} autoFetch - Whether to fetch automatically on mount (default: true)
 */
export const useFetch = (url, autoFetch = true) => {
  const getCachedData = () => {
    try {
      if (!url) return null;
      const cached = localStorage.getItem(`cache_${url}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          return parsed.data;
        }
      }
    } catch (e) {}
    return null;
  };

  const [data, setData] = useState(getCachedData);
  const [loading, setLoading] = useState(autoFetch && !getCachedData());
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customUrl, force = false) => {
    const fetchUrl = customUrl || url;
    if (!fetchUrl) return;

    if (!force) {
      try {
        const cached = localStorage.getItem(`cache_${fetchUrl}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(fetchUrl);
      const resultData = response.data.data !== undefined ? response.data.data : response.data;
      setData(resultData);
      
      try {
        localStorage.setItem(`cache_${fetchUrl}`, JSON.stringify({
          data: resultData,
          timestamp: Date.now()
        }));
      } catch (e) {}
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (autoFetch && url) {
      fetchData();
    }
  }, [fetchData, autoFetch, url]);

  const refetch = () => {
    return fetchData(null, true);
  };

  return { data, loading, error, refetch };
};
