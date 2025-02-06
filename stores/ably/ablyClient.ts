import Ably from "ably";

interface AblyTokenParams {
  ttl: number;
  capability: null;
  clientId: string;
  timestamp: number;
  keyName: string;
  mac: string;
  nonce: string;
}

export const getAblyClient = (tokenParams: AblyTokenParams): Ably.Realtime => {
  const clientOptions = {
    authCallback: (
      _: any,
      callback: (error: any, tokenDetails: any) => void,
    ) => {

      callback(null, tokenParams);
    },
  };

  return new Ably.Realtime(clientOptions);
};
