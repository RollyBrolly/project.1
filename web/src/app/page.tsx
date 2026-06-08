'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { ParentDashboard } from '@/components/ParentDashboard';
import { StudentDashboard } from '@/components/StudentDashboard';
import { MerchantDashboard } from '@/components/MerchantDashboard';
import { Wallet2, User, GraduationCap, Store } from 'lucide-react';
import { getFriendbotUrl } from '@/lib/stellar';

type Role = 'parent' | 'student' | 'merchant';

export default function Home() {
  const [role, setRole] = useState<Role>('student');
  const { address: walletAddress, connect, error } = useWallet();
  const [roleAddresses, setRoleAddresses] = useState<Record<Role, string | null>>({
    parent: null,
    student: null,
    merchant: null,
  });
  const [isFunding, setIsFunding] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleConnect = async () => {
    const addr = await connect();
    if (addr) {
      setRoleAddresses(prev => ({
        ...prev,
        [role]: addr
      }));
    }
  };

  const activeAddress = roleAddresses[role];

  const fundAccount = async () => {
    if (!activeAddress) return;
    setIsFunding(true);
    try {
      console.log('Funding account:', activeAddress);
      const response = await fetch(getFriendbotUrl(activeAddress));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Friendbot error details:', errorData);
        
        // If it's a 400, the account might already exist
        if (response.status === 400) {
          console.log('Account might already be funded or exists.');
          setRefreshTrigger(prev => prev + 1);
          return;
        }
        throw new Error(`Friendbot failed with status ${response.status}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Account funded successfully');
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.error('Funding failed', e);
      alert('Funding failed. Your account might already have XLM, or Friendbot is busy. Try refreshing the balance manually.');
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Wallet2 size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CanteenPay</h1>
          </div>

          <div className="flex items-center gap-4">
            {activeAddress ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{role}</span>
                  <span className="text-sm font-medium bg-slate-100 px-3 py-0.5 rounded-full text-slate-600">
                    {activeAddress.slice(0, 4)}...{activeAddress.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={fundAccount}
                  disabled={isFunding}
                  className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1 rounded-full font-semibold transition-colors disabled:opacity-50"
                >
                  {isFunding ? 'Funding...' : 'Get Test XLM'}
                </button>
                <button
                  onClick={handleConnect}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Switch
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Role Switcher */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-4">Select View</p>
            <button
              onClick={() => setRole('parent')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                role === 'parent' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-white text-slate-600'
              }`}
            >
              <User size={20} />
              <span className="font-semibold">Parent</span>
            </button>
            <button
              onClick={() => setRole('student')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                role === 'student' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-white text-slate-600'
              }`}
            >
              <GraduationCap size={20} />
              <span className="font-semibold">Student</span>
            </button>
            <button
              onClick={() => setRole('merchant')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                role === 'merchant' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-white text-slate-600'
              }`}
            >
              <Store size={20} />
              <span className="font-semibold">Merchant</span>
            </button>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {!activeAddress ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-6">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-600">
                  <Wallet2 size={40} />
                </div>
                <div className="max-w-xs mx-auto space-y-2">
                  <h2 className="text-2xl font-bold text-capitalize">Connect {role} wallet</h2>
                  <p className="text-slate-500">To use CanteenPay as a {role}, please connect your {role} wallet via Freighter.</p>
                </div>
                <button
                  onClick={handleConnect}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
                >
                  Connect {role.charAt(0).toUpperCase() + role.slice(1)} Wallet
                </button>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
              </div>
            ) : (
              <div className="space-y-6">
                {role === 'parent' && <ParentDashboard address={activeAddress} refreshTrigger={refreshTrigger} />}
                {role === 'student' && <StudentDashboard address={activeAddress} refreshTrigger={refreshTrigger} />}
                {role === 'merchant' && <MerchantDashboard address={activeAddress} refreshTrigger={refreshTrigger} />}
                
                <div className="mt-4 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500">
                    <strong>Note:</strong> You are currently using this address for the <strong>{role}</strong> role. 
                    To test the other roles with different wallets, switch roles and connect a different account in Freighter.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      
      {/* Footer / Info */}
      <footer className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-400 text-sm">Built for StellarX PH Workshop • USDC on Testnet</p>
      </footer>
    </main>
  );
}
