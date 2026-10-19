import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Admin and message endpoints contain private data and must never be persisted
// in browser storage. Public GET responses can still use the small cache below.
export const isProtectedEndpoint = (url = '') => (
  /^\/(?:admin(?:\/|$)|contact\/messages(?:\/|$)|projects\/admin(?:\/|$)|certificates\/admin(?:\/|$)|education\/admin(?:\/|$)|experience\/admin(?:\/|$)|hackathon\/admin(?:\/|$)|skills\/admin(?:\/|$)|social-media\/admin(?:\/|$))/.test(url)
);

const readCache = (url) => {
  if (!url || isProtectedEndpoint(url)) return null;

  try {
    const cached = localStorage.getItem(`cache_${url}`);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_TTL) {
      return parsed.data;
    }

    localStorage.removeItem(`cache_${url}`);
  } catch {
    localStorage.removeItem(`cache_${url}`);
  }

  return null;
};

const writeCache = (url, data) => {
  if (!url || isProtectedEndpoint(url)) return;

  try {
    localStorage.setItem(`cache_${url}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Storage is optional; the network response remains the source of truth.
    return;
  }
};

/**
 * Custom hook for fetching data using the configured axios instance.
 * @param {string} url - The endpoint to fetch from
 * @param {boolean} autoFetch - Whether to fetch automatically on mount (default: true)
 */
export const useFetch = (url, autoFetch = true) => {
  const [data, setData] = useState(() => readCache(url));
  const [loading, setLoading] = useState(() => autoFetch && !readCache(url));
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);
  const controllerRef = useRef(null);

  const fetchData = useCallback(async (customUrl, force = false) => {
    const fetchUrl = customUrl || url;
    if (!fetchUrl) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (!force) {
      const cachedData = readCache(fetchUrl);
      if (cachedData !== null) {
        if (requestId === requestIdRef.current) {
          setData(cachedData);
          setLoading(false);
        }
        return;
      }
    }

    setData(null);
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    try {
      const response = await api.get(fetchUrl, { signal: controller.signal });
      const resultData = response.data.data !== undefined ? response.data.data : response.data;
      if (requestId !== requestIdRef.current) return;
      setData(resultData);
      
      writeCache(fetchUrl, resultData);
    } catch (err) {
      if (err.code === 'ERR_CANCELED' || controller.signal.aborted || requestId !== requestIdRef.current) return;
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching data');
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < 300) {
        await new Promise(resolve => setTimeout(resolve, 300 - elapsed));
      }
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (autoFetch && url) {
      const request = window.setTimeout(() => { fetchData(); }, 0);
      return () => {
        window.clearTimeout(request);
        requestIdRef.current += 1;
        controllerRef.current?.abort();
      };
    }
    return undefined;
  }, [fetchData, autoFetch, url]);

  const refetch = () => {
    return fetchData(null, true);
  };

  return { data, loading, error, refetch };
};
