import { useState, useEffect, useCallback } from 'react';

const useRealtimeUpdates = (updateInterval = 300000) => { // 5분마다 업데이트
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setIsUpdating(true);
      const response = await fetch('/conflicts.json');
      const data = await response.json();
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
      return data;
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    // 초기 데이터 로드
    fetchData();

    // 주기적 업데이트 설정
    const interval = setInterval(fetchData, updateInterval);

    return () => clearInterval(interval);
  }, [fetchData, updateInterval]);

  const manualRefresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    lastUpdate,
    isUpdating,
    updateCount,
    manualRefresh
  };
};

export default useRealtimeUpdates;
