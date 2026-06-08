'use client';

import { useState } from 'react';
import { BalanceCard } from './BalanceCard';
import { createUSDCPayment, submitTransaction } from '@/lib/payment';
import { useWallet } from '@/hooks/useWallet';
import { Send, UserPlus } from 'lucide-react';

export function ParentDashboard({ address, refreshTrigger }: { address: string; refreshTrigger?: number }) {
  const [studentAddress, setStudentAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { sign } = useWallet();

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAddress || !amount) return;

    setLoading(true);
    try {
      const tx = await createUSDCPayment(address, studentAddress, amount);
      const signed = await sign(tx.toXDR());
      await submitTransaction(signed);
      alert('Top-up successful!');
      setAmount('');
    } catch (e) {
      console.error('Top-up failed', e);
      alert('Top-up failed. Check student address and your balance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceCard address={address} label="Your Balance (Parent)" refreshTrigger={refreshTrigger} />
        <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col justify-center">
          <h3 className="font-bold text-lg mb-2">School Canteen Allowance</h3>
          <p className="text-blue-100 text-sm mb-4">Send USDC to your child's wallet for their weekly meals. No cash, no fuss.</p>
          <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-200">
            <Send size={14} /> Instant Transfer
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <UserPlus className="text-blue-600" /> Top Up Student
        </h3>
        <form onSubmit={handleTopUp} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Student Wallet Address</label>
            <input
              type="text"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              placeholder="G..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Amount (USDC)</label>
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
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? 'Processing...' : 'Send Allowance'}
          </button>
        </form>
      </div>
    </div>
  );
}
