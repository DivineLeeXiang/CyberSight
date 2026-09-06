import React, { useState } from 'react';
import {
  Shield, Eye, EyeOff, Lock, User, Landmark, Car, Building2, AlertCircle, CheckCircle2
} from 'lucide-react';

// Demo credentials for government portal demonstration
const DEMO_CREDENTIALS = [
  {
    username: 'I4C_ADMIN',
    password: 'CyberNetra@2026',
    role: 'i4c',
    name: 'Apex I4C Commander',
    designation: 'Director, Indian Cyber Crime Coordination Centre',
    badge: 'I4C/HQ/001',
    clearance: 'TOP SECRET'
  },
  {
    username: 'LEA_OFFICER',
    password: 'Cyber@LEA2026',
    role: 'lea',
    name: 'Dy. SP Cyber Cell',
    designation: 'District Cyber Crime Cell, Delhi',
    badge: 'DCP/CYBER/DEL/042',
    clearance: 'CONFIDENTIAL'
  },
  {
    username: 'BEAT_PCR',
    password: 'Beat@PCR2026',
    role: 'beat',
    name: 'SI Field Beat Officer',
    designation: 'PCR Unit, South Delhi',
    badge: 'PCR/SD/402',
    clearance: 'RESTRICTED'
  },
  {
    username: 'BANK_NODAL',
    password: 'Bank@CFCFRMS2026',
    role: 'bank',
    name: 'Bank Nodal Officer',
    designation: 'CFCFRMS Liaison, State Bank of India',
    badge: 'SBI/CFCFRMS/2026',
    clearance: 'RESTRICTED'
  }
];

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay (realistic gov portal behavior)
    await new Promise((r) => setTimeout(r, 800));

    const match = DEMO_CREDENTIALS.find(
      (c) => c.username === username.trim().toUpperCase() && c.password === password
    );

    if (match) {
      // Store session token in sessionStorage (gov security standard — clears on tab close)
      const token = btoa(JSON.stringify({ user: match.username, role: match.role, ts: Date.now() }));
      sessionStorage.setItem('cybernetra_token', token);
      sessionStorage.setItem('cybernetra_user', JSON.stringify(match));
      onLogin(match);
    } else {
      setError('Invalid credentials. Access denied. This attempt has been logged.');
    }
    setIsLoading(false);
  };

  const fillDemo = (cred) => {
    setUsername(cred.username);
    setPassword(cred.password);
    setShowCredentials(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      {/* Official Government Tricolor Stripe */}
      <div className="fixed top-0 left-0 right-0 h-1.5 flex z-50">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-slate-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Gov Identity Strip */}
      <div className="fixed top-1.5 left-0 right-0 bg-slate-900 text-slate-300 text-[11px] font-medium px-6 py-1 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">भारत सरकार</span>
          <span className="text-slate-600">|</span>
          <span>Government of India • गृह मंत्रालय | Ministry of Home Affairs</span>
        </div>
        <span className="text-slate-500 text-[10px] font-mono hidden sm:block">
          RESTRICTED ACCESS — AUTHORISED PERSONNEL ONLY
        </span>
      </div>

      <div className="mt-10 w-full max-w-md">
        {/* Portal Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center shadow-lg border-4 border-blue-800">
              <Shield className="w-9 h-9 text-amber-300" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-blue-950 tracking-tight font-heading">
            CYBER-NETRA
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Predictive Analytics & Proactive Intervention Platform
          </p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Indian Cyber Crime Coordination Centre (I4C) | NCRP
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold font-mono">
            <Lock className="w-3 h-3" />
            RESTRICTED GOVERNMENT SYSTEM
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-950 px-6 py-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-300" />
            <span className="text-white text-sm font-semibold">SECURE PORTAL LOGIN</span>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Officer ID / Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. I4C_ADMIN"
                  required
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-mono placeholder:font-sans placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-white py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  SECURE LOGIN
                </>
              )}
            </button>

            {/* Demo Credentials Toggle */}
            <div className="border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {showCredentials ? 'Hide' : 'Show'} Demo Credentials (Development Mode)
              </button>

              {showCredentials && (
                <div className="mt-3 space-y-2">
                  <p className="text-[10px] text-slate-400 text-center font-mono uppercase">
                    — Click any role to autofill —
                  </p>
                  {DEMO_CREDENTIALS.map((c) => (
                    <button
                      key={c.username}
                      type="button"
                      onClick={() => fillDemo(c)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200">
                        {c.role === 'i4c' ? <Landmark className="w-4 h-4 text-blue-900" /> :
                         c.role === 'lea' ? <Shield className="w-4 h-4 text-blue-900" /> :
                         c.role === 'beat' ? <Car className="w-4 h-4 text-blue-900" /> :
                         <Building2 className="w-4 h-4 text-blue-900" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 font-mono">{c.username}</div>
                        <div className="text-[10px] text-slate-500 truncate">{c.designation}</div>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                        {c.clearance}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer Warning */}
        <div className="mt-4 text-center text-[10px] text-slate-400 space-y-1 font-mono">
          <p>Unauthorised access is a criminal offence under IT Act 2000, Section 66.</p>
          <p>All sessions are logged and monitored by CERT-In.</p>
        </div>
      </div>
    </div>
  );
}
