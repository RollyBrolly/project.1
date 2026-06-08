'use client';

import { useState, useEffect } from 'react';
import { BalanceCard } from './BalanceCard';
import { createUSDCPayment, submitTransaction } from '@/lib/payment';
import { useWallet } from '@/hooks/useWallet';
import { Scan, CreditCard, X, Camera } from 'lucide-react';
// html5-qrcode is imported dynamically in useEffect

export function MerchantDashboard({ address, refreshTrigger }: { address: string; refreshTrigger?: number }) {
  const [studentAddress, setStudentAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { sign } = useWallet();

  useEffect(() => {
    let scanner: any = null;

    if (isScanning) {
      const startScanner = async () => {
        try {
          const { Html5QrcodeScanner } = await import('html5-qrcode');
          scanner = new Html5QrcodeScanner(
            'reader',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText: string) => {
              setStudentAddress(decodedText);
              setIsScanning(false);
              scanner?.clear();
            },
            (error: any) => {
              // console.warn(error);
            }
          );
        } catch (e) {
          console.error("Failed to start scanner", e);
        }
      };
      
      startScanner();
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((e: any) => console.error("Failed to clear scanner", e));
      }
    };
  }, [isScanning]);

  const handleCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAddress || !amount) return;

    setLoading(true);
    try {
      // For the demo: Merchant builds the tx where Student is Source
      const tx = await createUSDCPayment(studentAddress, address, amount);
      const signed = await sign(tx.toXDR());
      await submitTransaction(signed);
      alert('Payment received successfully!');
      setStudentAddress('');
      setAmount('');
    } catch (e) {
      console.error('Charge failed', e);
      alert('Charge failed. Ensure the student has a USDC trustline and sufficient balance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <BalanceCard address={address} label="Merchant Earnings (Canteen)" refreshTrigger={refreshTrigger} />

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CreditCard className="text-blue-600" /> New Transaction
        </h3>

        {isScanning ? (
          <div className="space-y-4">
            <div id="reader" className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-200"></div>
            <button
              onClick={() => setIsScanning(false)}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
            >
              <X size={18} /> Cancel Scanner
            </button>
          </div>
        ) : (
          <form onSubmit={handleCharge} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Student Address</label>
                <input
                  type="text"
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  placeholder="Scan or paste G..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setIsScanning(true)}
                  className="bg-blue-50 text-blue-600 p-3.5 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
                  title="Scan QR Code"
                >
                  <Camera size={24} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Charge Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">USDC</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !studentAddress}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <Scan size={20} />
              {loading ? 'Waiting for Student Signature...' : 'Charge Student'}
            </button>
          </form>
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-2">Merchant Info</h4>
        <p className="text-sm text-slate-500 leading-relaxed">
          Payments are received instantly in USDC. Make sure the student is ready to sign the transaction on their device (or use the same connected wallet for this workshop).
        </p>
      </div>
    </div>
  );
}
