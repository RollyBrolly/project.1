import { server, USDC_ASSET } from './stellar';
import { Horizon } from '@stellar/stellar-sdk';

export interface AssetBalance {
  code: string;
  issuer?: string;
  balance: string;
}

export async function getBalances(address: string): Promise<AssetBalance[]> {
  try {
    const account = await server.loadAccount(address);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return account.balances.map((b: any) => {
      if (b.asset_type === 'native') {
        return { code: 'XLM', balance: b.balance };
      } else {
        return {
          code: b.asset_code || 'UNKNOWN',
          issuer: b.asset_issuer,
          balance: b.balance,
        };
      }
    });
  } catch (e) {
    console.error('Error fetching balances:', e);
    return [];
  }
}

export async function getUSDCBalance(address: string): Promise<string> {
  const balances = await getBalances(address);
  const usdc = balances.find(
    (b) => b.code === USDC_ASSET.code && b.issuer === USDC_ASSET.issuer
  );
  return usdc ? usdc.balance : '0';
}

export async function hasUSDCTrustline(address: string): Promise<boolean> {
  const balances = await getBalances(address);
  return balances.some(
    (b) => b.code === USDC_ASSET.code && b.issuer === USDC_ASSET.issuer
  );
}
