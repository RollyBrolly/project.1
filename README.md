# CanteenPay

A Stellar testnet campus canteen demo for cashless student meal allowances using USDC payments, wallet connect, and QR-based student receipts.

## Problem
Parents and school canteen vendors need a simple cashless way to send and receive meal allowance payments. Students and merchants in the Philippines especially benefit from an easy, low-friction mobile payment flow that avoids cash and manual bookkeeping.

## How It Works
- Parents connect a Freighter wallet and top up a student’s wallet with USDC.
- Students display their payment address as a QR code to pay the canteen.
- Merchants scan the student QR code and create a signed payment transaction to receive USDC.

## How It Uses Stellar
- Uses Stellar Testnet for live payment flows with real transaction submission.
- Builds native Stellar transactions with `@stellar/stellar-sdk` and `Operation.payment`.
- Uses the USDC testnet asset via a specific issuer trustline.
- Connects to Freighter via `@stellar/freighter-api` for wallet address retrieval and transaction signing.
- Uses Horizon Testnet for account loading, Friendbot funding, and transaction submission.

## Track
Track 2 Financial Inclusion & Everyday Payments

## Tech Stack
- Framework: Next.js 16 + React + TypeScript
- Stellar SDK: `@stellar/stellar-sdk` v15.x
- Network: testnet
- Key dependencies: `@stellar/freighter-api`, `qrcode.react`, `html5-qrcode`, `lucide-react`

## Setup & Run
```bash
git clone https://github.com/RollyBrolly/project.1.git
cd project.1/web
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Notes
- Install Freighter and switch it to Test Net.
- Use the app's "Get Test XLM" button to fund the connected wallet via Friendbot.
- No extra environment variables are required for the core demo.

## Network Details
- Network: testnet
- RPC URL: `https://horizon-testnet.stellar.org`
- USDC issuer: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVSL4NAT4AQH3ZLLFLA5`
- Contract IDs: N/A

## Team
- Solo contributor — @RollyBrolly

## License
MIT
