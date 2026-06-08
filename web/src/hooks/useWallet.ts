import { useState, useEffect } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      console.log('Attempting to connect to Freighter...');
      const { getAddress, isConnected } = await import('@stellar/freighter-api');
      
      const connected = await isConnected();
      console.log('Freighter isConnected:', connected);
      
      if (!connected) {
        setError('Freighter is not installed or not connected');
        return null;
      }

      const { address: userAddress, error: connectError } = await getAddress();
      console.log('Freighter getAddress response:', { userAddress, connectError });
      
      if (connectError) {
        setError(connectError);
        return null;
      }

      setAddress(userAddress);
      setError(null);
      return userAddress;
    } catch (e) {
      console.error('Freighter connection error:', e);
      setError('Failed to connect to Freighter. Check console for details.');
      return null;
    }
  };

  const sign = async (xdr: string) => {
    try {
      const { signTransaction } = await import('@stellar/freighter-api');
      const result = await signTransaction(xdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
      });

      // Freighter v6 returns an object, older versions returned string
      if (typeof result === 'string') {
        return result;
      }
      return result.signedTxXdr;
    } catch (e) {
      console.error('Signing error:', e);
      throw e;
    }
  };

  return { address, error, connect, sign };
}
