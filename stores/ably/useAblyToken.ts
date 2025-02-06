import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAblyToken } from "@/services/misc";
import { getAblyClient } from "./ablyClient";

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
  //@ts-ignore
  const [ablyClient, setAblyClient] = useState<Ably.Realtime | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("disconnected");

  const getNotificationChannel = (clientId: string) => `${clientId}`;

  const {
    data: tokenData,
    refetch,
    isLoading,
    error,
  } = useQuery<AblyToken>({
    queryKey: ["getAblyToken"],
    //@ts-ignore
    queryFn: getAblyToken,
    retry: 1,
    refetchInterval: shouldRefresh ? 0 : false,
  });

  const startTTLCountdown = useCallback((ttl: number) => {
    setTimeRemaining(ttl);
    setShouldRefresh(false);
  }, []);

  useEffect(() => {
    //@ts-ignore
    if (tokenData?.token?.ttl) {
      //@ts-ignore
      startTTLCountdown(tokenData.token.ttl);
    }
    //@ts-ignore
  }, [tokenData?.token?.ttl, startTTLCountdown]);

  useEffect(() => {
    if (shouldRefresh) {
      refetch();
    }
  }, [shouldRefresh, refetch]);

  useEffect(() => {
    //@ts-ignore
    if (tokenData?.token) {
      try {
        if (ablyClient) {
          ablyClient.close();
        }
        //@ts-ignore
        const client = getAblyClient(tokenData.token);
        const handleConnectionStateChange = (
          //@ts-ignore
          stateChange: Ably.ConnectionStateChange,
        ) => {
          console.log(`Ably connection state: ${stateChange.current}`);
          setConnectionStatus(stateChange.current);

          switch (stateChange.current) {
            case "connected":
              setConnectionError(null);
              break;
            case "disconnected":
              console.log("Attempting to reconnect...");
              client.connection.connect();
              break;
            case "failed":
              setConnectionError(
                stateChange.reason?.message || "Connection failed",
              );
              break;
          }
        };

        client.connection.on(handleConnectionStateChange);

        // Force initial connection
        client.connection.connect();

        setAblyClient(client);

        return () => {
          client.connection.off(handleConnectionStateChange);
          client.close();
        };
      } catch (err) {
        console.error("Error initializing Ably client:", err);
        setConnectionError(
          err instanceof Error ? err.message : "Unknown error",
        );
      }
    }
    //@ts-ignore
  }, [tokenData?.token]);
  //@ts-ignore
  const channelName = tokenData?.token?.clientId
    ? //@ts-ignore
      getNotificationChannel(tokenData.token.clientId)
    : null;

  return {
    //@ts-ignore
    token: tokenData?.token,
    timeRemaining,
    isLoading,
    error,
    ablyClient,
    channelName,
    //@ts-ignore
    clientId: tokenData?.token?.clientId,
    connectionError,
    connectionStatus,
  };
};
