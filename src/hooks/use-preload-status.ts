import { useState, useEffect } from 'react';

interface PreloadStatus {
  isPreloaded: boolean;
  lastPreloadTime: number | null;
  isLoading: boolean;
}

export const usePreloadStatus = () => {
  const [status, setStatus] = useState<PreloadStatus>({
    isPreloaded: false,
    lastPreloadTime: null,
    isLoading: false,
  });

  // Verificar se já foi pré-carregado hoje
  useEffect(() => {
    const checkPreloadStatus = () => {
      const preloadData = localStorage.getItem('preload_status');
      if (preloadData) {
        const { timestamp, date } = JSON.parse(preloadData);
        const today = new Date().toDateString();
        
        if (date === today) {
          setStatus(prev => ({
            ...prev,
            isPreloaded: true,
            lastPreloadTime: timestamp,
          }));
        }
      }
    };

    checkPreloadStatus();
  }, []);

  const markAsPreloaded = () => {
    const now = Date.now();
    const today = new Date().toDateString();
    
    localStorage.setItem('preload_status', JSON.stringify({
      timestamp: now,
      date: today,
    }));

    setStatus({
      isPreloaded: true,
      lastPreloadTime: now,
      isLoading: false,
    });
  };

  const setLoading = (loading: boolean) => {
    setStatus(prev => ({
      ...prev,
      isLoading: loading,
    }));
  };

  const resetPreloadStatus = () => {
    localStorage.removeItem('preload_status');
    setStatus({
      isPreloaded: false,
      lastPreloadTime: null,
      isLoading: false,
    });
  };

  return {
    ...status,
    markAsPreloaded,
    setLoading,
    resetPreloadStatus,
  };
}; 