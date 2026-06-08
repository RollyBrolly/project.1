'use client';

import { useState, useEffect } from 'react';
import { getUSDCBalance, hasUSDCTrustline } from '@/lib/balances';
import { createTrustline, submitTransaction } from '@/lib/payment';
import { useWallet } from '@/hooks/useWallet';
import { RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function BalanceCard({ 
  address, 
  label, 
  refreshTrigger 
}: { 
  address: string; 
  label: string;
  refreshTrigger?: number;
}) {
  const [balance, setBalance] = useState<string>('0');
  const [hasTrust, setHasTrust] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { sign } = useWallet();

  const loadData = async () => {
    setLoading(true);
    try {
      const b = await getUSDCBalance(address);
      const t = await hasUSDCTrustline(address);
      setBalance(b);
      setHasTrust(t);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [address, refreshTrigger]);

  const handleAddTrust = async () => {
    setActionLoading(true);
    try {
      const tx = await createTrustline(address);
      const signed = await sign(tx.toXDR());
      await submitTransaction(signed);
      await loadData();
    } catch (e) {
      console.error('Failed to add trustline', e);
      alert('Failed to add trustline. Make sure you have XLM for fees.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-slate-900">{parseFloat(balance).toLocaleString()}</span>
            <span className="text-sm font-bold text-blue-600">USDC</span>
          </div>
        </div>
        <button 
          onClick={loadData}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
          title="Refresh balance"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {!hasTrust && !loading && (
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-700">
            <ShieldAlert size={18} />
            <span className="text-xs font-bold">USDC Trustline required</span>
          </div>
          <button
            onClick={handleAddTrust}
            disabled={actionLoading}
            className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {actionLoading ? 'Adding...' : 'Add Now'}
          </button>
        </div>
      )}

      {hasTrust && !loading && (
        <div className="mt-4 flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={14} />
          <span className="text-[10px] font-bold uppercase tracking-tight">Verified USDC Account</span>
        </div>
      )}
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent -mr-12 -mt-12 rounded-full opacity-50" />
    </div>
  );
}
