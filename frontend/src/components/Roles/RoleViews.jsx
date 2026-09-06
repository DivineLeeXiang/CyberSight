import React from 'react';
import { 
  Landmark, Shield, Car, Building2, AlertTriangle, 
  Clock, MapPin, CheckCircle, ExternalLink, Lock, FileText, Send, Radio
} from 'lucide-react';

export function I4CCommandView({ status, hotspots = [], predictions = [], onViewDossier }) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 text-xs font-mono font-bold">
                MHA / I4C APEX STRATEGIC DESK
              </span>
              <span className="text-xs text-slate-500 font-medium">CITIZEN FINANCIAL CYBER FRAUD DEFENSE</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              National Cybercrime Cash-Out Forecasting & Inter-Agency Command
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
              Automated ingestion of ~8,000 daily complaints from the centralized portal. AI spatio-temporal models forecast physical cash withdrawal points within the Golden Hour window, coordinating 36 State Police Forces and 28 Commercial Banks to intercept runners and freeze mule trails before extraction.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-300 shrink-0">
            <Radio className="w-6 h-6 text-red-600 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-500 font-mono block font-bold">INTERSTATE NEXUS</span>
              <span className="text-sm font-bold text-red-700 font-mono">31 ACTIVE CORRIDORS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Syndicate Corridors & Nationwide Heat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotspot Vulnerability Index */}
        <div className="lg:col-span-2 bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 font-heading mb-4 flex items-center justify-between">
            <span>HIGH-RISK MULE CASH-OUT CORRIDORS (SURVEILLANCE ZONES)</span>
            <span className="text-xs font-mono text-slate-500">MULE DENSITY RATING</span>
          </h3>

          <div className="space-y-3">
            {hotspots.map((hs) => (
              <div key={hs.id} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{hs.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 font-semibold">
                      {hs.state} ({hs.district})
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-red-700">
                    Index: {hs.mule_density_index}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600"
                    style={{ width: `${hs.mule_density_index}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>Primary Modus: {hs.primary_crimes?.slice(0, 2).join(', ')}</span>
                  <span className="font-mono text-slate-800 font-bold">{hs.historical_cashout_count} Historic Incidents</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* National Interventions Summary */}
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading mb-4">
              INTER-AGENCY RESOLUTION KPI
            </h3>
            <div className="space-y-3.5 font-mono text-xs">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">TOTAL FRAUD CASH-OUTS BLOCKED</span>
                <span className="text-xl font-bold text-emerald-800">
                  ₹{((status?.estimated_fraud_blocked_inr || 48500000) / 10000000).toFixed(2)} Crores
                </span>
                <span className="text-[10px] text-slate-500 block mt-1 font-sans">Across 142 Proactive Police Interceptions</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">AVERAGE TIME-TO-INTERCEPT</span>
                <span className="text-xl font-bold text-blue-900">22.4 Minutes</span>
                <span className="text-[10px] text-slate-500 block mt-1 font-sans">Well inside 60-min Golden Hour</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">BANK COOPERATION (CFCFRMS)</span>
                <span className="text-xl font-bold text-purple-900">99.4% Auto-Lien Rate</span>
                <span className="text-[10px] text-slate-500 block mt-1 font-sans">Avg account freeze response: 4.8 minutes</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-slate-700 font-medium">
            <span className="font-bold text-blue-900 block mb-1">MHA Standard Operating Procedure (SOP)</span>
            High-probability cash withdrawal alerts are automatically dispatched simultaneously to District Police Stations and Bank Nodal Officers for coordinated inter-jurisdiction defense.
          </div>
        </div>
      </div>
    </div>
  );
}

export function FieldBeatOfficerView({ predictions = [], onDispatch }) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-200">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-blue-900 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
              TACTICAL FIELD INTERCEPTOR (PCR / BEAT PATROL)
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-heading mt-1">
              Field Beat Units & Mobile Interception Desk
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Immediate ATM dispatch cards with Google Maps turn-by-turn navigation and suspect runner modus operandi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {predictions.map((pred) => {
          const atm = pred.predicted_target_atm;
          const isCritical = pred.risk_level === 'CRITICAL';
          const isDispatched = pred.intervention_status.includes('Dispatched');

          return (
            <div 
              key={pred.id} 
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all bg-white shadow-sm ${
                isCritical 
                  ? 'border-red-400 ring-1 ring-red-300' 
                  : 'border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isCritical ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}>
                    {pred.risk_level} INTERCEPT
                  </span>
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-red-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ETA ~{pred.eta_minutes}m</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{atm.name}</h3>
                <p className="text-xs text-slate-600 mb-3">{atm.address} (PIN: {atm.pincode})</p>

                {/* Modus Operandi Advice */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono mb-4 space-y-1.5">
                  <div className="text-slate-600">
                    Target Amount: <span className="text-red-700 font-bold">₹{pred.predicted_amount_to_withdraw?.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-600">
                    Nearest Station: <span className="text-slate-900 font-semibold">{atm.nearest_police_station} ({atm.distance_to_station_km}km)</span>
                  </div>
                  <div className="text-slate-600">
                    SHO Duty: <span className="text-blue-900 font-bold">{atm.sho_contact}</span>
                  </div>
                  <div className="text-amber-800 text-[11px] pt-1.5 border-t border-slate-200 font-sans font-medium">
                    ⚠️ Field Tactical Tip: Look for suspicious runners testing ATM withdrawal cards in rapid tranches of ₹49,999.
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://maps.google.com/?q=${atm.latitude},${atm.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>GPS Navigate</span>
                </a>

                <button
                  onClick={() => onDispatch(pred)}
                  className="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isDispatched ? 'Unit En Route' : 'Accept Dispatch'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BankNodalView({ predictions = [], onFreeze }) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-200">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-purple-900 px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
              CFCFRMS / 1930 BANK NODAL OFFICER DESK
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-heading mt-1">
              Citizen Financial Cyber Fraud Reporting & Rapid Lien Management
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Real-time feed of multi-layer beneficiary mule accounts with 1-click legal freeze authorizations.
            </p>
          </div>
        </div>
      </div>

      {/* Table of Mule Accounts */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold">
              <tr>
                <th className="p-3.5">NCRP ACK NO</th>
                <th className="p-3.5">TARGETED ATM / CSP</th>
                <th className="p-3.5">AMOUNT AT RISK</th>
                <th className="p-3.5">ESTIMATED CASHOUT</th>
                <th className="p-3.5">AI CONFIDENCE</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {predictions.map((pred, idx) => {
                const atm = pred.predicted_target_atm;
                const isFrozen = pred.intervention_status.includes('Frozen');

                return (
                  <tr key={pred.id} className={idx % 2 === 0 ? "bg-white hover:bg-slate-50" : "bg-slate-50/50 hover:bg-slate-100"}>
                    <td className="p-3.5 font-bold text-blue-950">{pred.complaint_id}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{atm.name}</div>
                      <div className="text-[11px] text-slate-500">{atm.bank} • PIN: {atm.pincode}</div>
                    </td>
                    <td className="p-3.5 text-red-700 font-bold">
                      ₹{pred.predicted_amount_to_withdraw?.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-slate-800 font-bold">
                      in ~{pred.eta_minutes} mins
                    </td>
                    <td className="p-3.5 text-emerald-800 font-bold">
                      {pred.confidence_score}%
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        isFrozen ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {pred.intervention_status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onFreeze(pred)}
                        disabled={isFrozen}
                        className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold px-3 py-1.5 rounded text-xs transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Lock className="w-3 h-3" />
                        <span>{isFrozen ? 'Lien Placed' : '1-Click Freeze'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
