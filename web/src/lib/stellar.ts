import { Networks, Horizon } from '@stellar/stellar-sdk';

export const STELLAR_NETWORK = Networks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const SOROBAN_URL = 'https://soroban-testnet.stellar.org';

// USDC Testnet (Circle)
export const USDC_ASSET = {
  code: 'USDC',
  issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
};

export const server = new Horizon.Server(HORIZON_URL);

export const getFriendbotUrl = (address: string) =>
  `https://friendbot.stellar.org?addr=${address}`;
