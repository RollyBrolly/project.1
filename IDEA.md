# School Canteen Digital Wallet

## Idea
- **Track:** Financial Inclusion / Social Impact
- **Idea # (from the 300-ideas list, if any):** 70
- **One-liner:** A digital canteen wallet for students that replaces cash with Stellar USDC, allowing parents to top up and monitor spending.

## Problem
Parents give students cash for the canteen — cash gets lost, stolen, or misused. Students often lack financial tracking, and merchants deal with small change. CanteenPay digitizes this using USDC for stable, instant payments.

## How it uses Stellar
- **Payments:** Core mechanism for top-ups (Parent -> Student) and meal payments (Student -> Merchant).
- **USDC (Testnet):** Used as a stable medium of exchange to avoid XLM price volatility for daily meals.
- **Trustlines:** Managed within the app to allow students and merchants to receive USDC.
- **QR Payments:** Standardized QR codes for student identification at checkout.

## What works in the demo
- [x] Connect wallet (Freighter, testnet)
- [x] Parent Dashboard: View balances and top up students.
- [x] Student Dashboard: View allowance and show QR code for payment.
- [x] Merchant Dashboard: Scan student QR and initiate USDC charges.

## Setup / run
- Network: **testnet**
- `cd web && npm install && npm run dev`
- **Wallet:** Use Freighter on Testnet. Fund your account with Friendbot using the "Get Test XLM" button in the app.
- **USDC:** The app will prompt you to "Add Trustline" if you don't have one for USDC.

## Demo
- 2–4 min video link (show the core flow working on testnet):
- Public repo link:

## Submission checklist
- [ ] Public GitHub repo with a license (this scaffold ships MIT — update `LICENSE`)
- [ ] README explains problem, Stellar usage, and setup
- [ ] Demo video (2–4 min)
- [ ] Submitted via the workshop's official GitHub issue template
