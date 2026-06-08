import {
  Asset,
  Operation,
  TransactionBuilder,
  TimeoutInfinite,
} from '@stellar/stellar-sdk';
import { server, STELLAR_NETWORK, USDC_ASSET } from './stellar';

export async function createUSDCPayment(
  fromAddress: string,
  toAddress: string,
  amount: string
) {
  const account = await server.loadAccount(fromAddress);
  const asset = new Asset(USDC_ASSET.code, USDC_ASSET.issuer);

  const transaction = new TransactionBuilder(account, {
    fee: '1000',
    networkPassphrase: STELLAR_NETWORK,
  })
    .addOperation(
      Operation.payment({
        destination: toAddress,
        asset: asset,
        amount: amount,
      })
    )
    .setTimeout(TimeoutInfinite)
    .build();

  return transaction;
}

export async function createTrustline(address: string) {
  const account = await server.loadAccount(address);
  const asset = new Asset(USDC_ASSET.code, USDC_ASSET.issuer);

  const transaction = new TransactionBuilder(account, {
    fee: '1000',
    networkPassphrase: STELLAR_NETWORK,
  })
    .addOperation(
      Operation.changeTrust({
        asset: asset,
      })
    )
    .setTimeout(TimeoutInfinite)
    .build();

  return transaction;
}

export async function submitTransaction(signedXdr: string) {
  const transaction = TransactionBuilder.fromXDR(signedXdr, STELLAR_NETWORK);
  try {
    const result = await server.submitTransaction(transaction);
    return result;
  } catch (e) {
    console.error('Submission failed:', e);
    throw e;
  }
}
