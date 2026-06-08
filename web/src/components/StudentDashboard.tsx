'use client';

import { BalanceCard } from './BalanceCard';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function StudentDashboard({ address, refreshTrigger }: { address: string; refreshTrigger?: number }) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <BalanceCard address={address} label="Your Allowance (Student)" refreshTrigger={refreshTrigger} />

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
            <QrCode className="text-blue-600" /> Pay at Canteen
          </h3>
          <p className="text-slate-500 text-sm">Show this QR code to the merchant to pay for your meal.</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl inline-block border border-slate-100 shadow-inner">
          <QRCodeSVG 
            value={address} 
            size={200}
            level="H"
            includeMargin={true}
            className="rounded-lg"
          />
        </div>

        <div className="mt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Wallet Address</p>
          <div className="flex items-center justify-center gap-2">
            <code className="bg-slate-100 px-3 py-2 rounded-lg text-[10px] md:text-xs font-mono text-slate-600 max-w-[200px] md:max-w-none truncate">
              {address}
            </code>
            <button
              onClick={copyAddress}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="font-bold text-blue-800 mb-2">How to pay?</h4>
        <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
          <li>Ask the merchant for the total amount.</li>
          <li>Show them the QR code above.</li>
          <li>Approve the payment on your device if prompted.</li>
        </ol>
      </div>
    </div>
  );
}
