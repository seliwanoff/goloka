// src/hooks/useAblyToken.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAblyToken } from '@/services/misc';

interface AblyToken {
  message: string;
  token: {
    capability: null;
    clientId: string;
    keyName: string;
    mac: string;
    nonce: string;
    timestamp: number;
    ttl: number;
  };
}

export const useAblyToken = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  const {
    data: tokenData,
    refetch,
    isLoading,
    error
  } = useQuery<AblyToken>({
    queryKey: ['getAblyToken'],
    queryFn: getAblyToken,
    retry: 1,
    refetchInterval: shouldRefresh ? 0 : false, // Only refetch when shouldRefresh is true
  });

  // Calculate time remaining and handle refresh
  const startTTLCountdown = useCallback((ttl: number) => {
    setTimeRemaining(ttl);

    // Reset shouldRefresh
    setShouldRefresh(false);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000; // Decrease by 1 second

        // If less than 5 minutes remaining, prepare for refresh
        if (newTime <= 300000) { // 5 minutes in milliseconds
          setShouldRefresh(true);
        }

        // If expired, clear interval
        if (newTime <= 0) {
          clearInterval(interval);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, []);

  // Start countdown when we get new token data
  useEffect(() => {
    if (tokenData?.token?.ttl) {
      const cleanup = startTTLCountdown(tokenData.token.ttl);
      return cleanup;
    }
  }, [tokenData?.token?.ttl, startTTLCountdown]);

  // Trigger refresh when shouldRefresh becomes true
  useEffect(() => {
    if (shouldRefresh) {
      refetch();
    }
  }, [shouldRefresh, refetch]);

  return {
    token: tokenData?.token,
    timeRemaining,
    isLoading,
    error
  };
};