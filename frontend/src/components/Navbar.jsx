import React from 'react';
import { 
  Shield, AlertTriangle, Radio, Activity, Landmark, 
  Car, Building2, Bell, PlusCircle, RefreshCw, Zap, Download, Volume2, VolumeX
} from 'lucide-react';

export default function Navbar({ 
  status, 
  activeRole, 
  setActiveRole, 
  onOpenInjectModal, 
  onToggleAlerts, 
  unreadAlertCount = 0,
  wsConnected = true,
  onExportCSV,
  soundEnabled,
  onToggleSound
}) {
  const roles = [
    { id: 'i4c', label: 'I4C Apex Command', icon: Landmark },
    { id: 'lea', label: 'District Cyber Cell', icon: Shield },
    { id: 'beat', label: 'Field Beat Units (PCR)', icon: Car },
    { id: 'bank', label: 'CFCFRMS Bank Nodal', icon: Building2 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Official Government of India Tricolor Top Stripe */}
      <div className="tricolor-stripe"></div>

      {/* Official Gov Identity Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1 text-[11px] font-sans border-b border-slate-800">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-amber-400 font-bold">भारत सरकार</span>
            <span className="text-slate-500">|</span>
            <span>Government of India</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">गृह मंत्रालय | Ministry of Home Affairs</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="hidden sm:inline text-slate-400">CITIZEN FINANCIAL CYBER FRAUD REPORTING (CFCFRMS / 1930)</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-slate-300">{wsConnected ? 'PORTAL GATEWAY ONLINE' : 'CONNECTING...'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1720px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Official Emblem & Portal Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-900 text-white shadow-sm border border-blue-800">
            <Shield className="w-6 h-6 text-amber-300" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-blue-950 font-heading flex items-center gap-2">
                CYBER-NETRA
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold">
                  I4C Predictive System
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              National Cybercrime Cash-Out Location Forecasting & Proactive Intervention Platform
            </p>
          </div>
        </div>

        {/* Center: Live National Metrics Ticker */}
        <div className="hidden lg:flex items-center gap-5 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-700" />
            <div>
              <span className="text-slate-500 text-[10px] block font-medium">DAILY INGESTION</span>
              <span className="text-slate-900 font-bold font-mono">
                {status?.daily_complaints_ingested?.toLocaleString() || '7,842'}/day
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-600 animate-pulse" />
            <div>
              <span className="text-slate-500 text-[10px] block font-medium">GOLDEN HOUR THREATS</span>
              <span className="text-red-700 font-bold font-mono">
                {status?.critical_interventions_pending || '8'} Active Hotspots
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" />
            <div>
              <span className="text-slate-500 text-[10px] block font-medium">INTERVENTIONS</span>
              <span className="text-emerald-800 font-bold font-mono">
                {status?.cash_outs_averted_today || '142'} Averted
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div>
            <span className="text-slate-500 text-[10px] block font-medium">FUNDS PROTECTED</span>
            <span className="text-blue-900 font-bold font-mono text-sm">
              ₹{((status?.estimated_fraud_blocked_inr || 48500000) / 10000000).toFixed(2)} Cr
            </span>
          </div>
        </div>

        {/* Right: Role Switcher & Action Tools */}
        <div className="flex items-center gap-2">
          {/* Government Role Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 text-xs">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Export Report (CSV) for Officers */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Download Daily Complaints & Forecast Report (CSV)"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          {/* Inject Test Scenario */}
          <button
            onClick={onOpenInjectModal}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Test AI Cash-Out Prediction on Fraud Scenario"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Test Scenario</span>
          </button>

          {/* Audio Chime Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors cursor-pointer"
            title={soundEnabled ? "Mute Alert Audio" : "Enable Alert Audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-900" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Alerts Drawer */}
          <button
            onClick={onToggleAlerts}
            className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors cursor-pointer"
            title="View Real-Time Alert Logs (SMS, WhatsApp, Bank API)"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadAlertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
