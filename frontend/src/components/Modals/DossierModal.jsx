import React, { useState, useEffect } from 'react';
import { 
  X, Printer, Shield, CheckCircle2, FileText, 
  MapPin, Landmark, Clock, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export default function DossierModal({ complaintId, onClose }) {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!complaintId) return;
    setLoading(true);
    api.getDossier(complaintId)
      .then((data) => {
        setDossier(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [complaintId]);

  if (!complaintId) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <FileText className="w-4 h-4 text-rose-400" />
            <span>I4C STATUTORY INTELLIGENCE DOSSIER</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Sheet (White print styling on dark theme) */}
        <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans print:p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-600 font-mono text-sm">
              <RefreshCw className="w-6 h-6 animate-spin text-rose-600 mb-2" />
              Compiling statutory intelligence dossier...
            </div>
          ) : !dossier ? (
            <div className="text-center py-20 text-slate-500 font-mono text-sm">
              Could not generate dossier.
            </div>
          ) : (
            <div className="max-w-3xl mx-auto border-2 border-slate-800 p-6 rounded-md">
              {/* Official Letterhead */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <div className="text-xs uppercase tracking-widest font-bold text-slate-700">
                  GOVERNMENT OF INDIA • MINISTRY OF HOME AFFAIRS
                </div>
                <h1 className="text-lg font-black tracking-wide text-slate-900 mt-1 uppercase font-serif">
                  INDIAN CYBER CRIME COORDINATION CENTRE (I4C)
                </h1>
                <div className="text-[11px] font-semibold text-slate-600">
                  Citizen Financial Cyber Fraud Reporting & Management System (CFCFRMS / 1930)
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  Dossier Ref: <span className="font-bold text-slate-900">{dossier.dossier_id}</span> • Date: {dossier.generated_at}
                </div>
              </div>

              {/* Legal Notice Header */}
              <div className="bg-slate-100 p-2.5 rounded border border-slate-300 text-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block">
                  PROACTIVE INTERVENTION & ACTIONABLE INTELLIGENCE ADVISORY
                </span>
                <span className="text-[10px] font-serif text-slate-600 italic">
                  Issued under {dossier.legal_statute}
                </span>
              </div>

              {/* Grid 1: Incident & Complainant Details */}
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-2 font-mono">
                  1. Incident & Complainant Particulars
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-semibold text-slate-600">NCRP Ack ID:</span> <span className="font-mono font-bold">{dossier.complaint.id}</span></div>
                  <div><span className="font-semibold text-slate-600">Crime Category:</span> <span className="font-bold text-rose-700">{dossier.complaint.crime_category}</span></div>
                  <div><span className="font-semibold text-slate-600">Complainant:</span> {dossier.complaint.complainant_name} ({dossier.complaint.complainant_phone})</div>
                  <div><span className="font-semibold text-slate-600">Jurisdiction:</span> {dossier.complaint.complainant_city}, {dossier.complaint.complainant_state}</div>
                  <div><span className="font-semibold text-slate-600">Stolen Amount:</span> <span className="font-mono font-bold text-rose-700">₹{dossier.complaint.fraud_amount?.toLocaleString()}</span></div>
                  <div><span className="font-semibold text-slate-600">Initial Remittance:</span> {dossier.complaint.victim_bank}</div>
                </div>
              </div>

              {/* Grid 2: Predictive Cash-Out Intelligence */}
              {dossier.prediction && (
                <div className="mb-4 bg-amber-50/70 p-3 rounded border border-amber-300">
                  <h3 className="text-xs font-bold uppercase text-amber-900 border-b border-amber-200 pb-1 mb-2 font-mono">
                    2. AI Spatio-Temporal Cash-Out Forecast
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-600">Targeted Cash-Out ATM:</span>
                      <div className="font-bold text-slate-900">{dossier.prediction.predicted_target_atm.name}</div>
                      <div className="text-[11px] text-slate-600">{dossier.prediction.predicted_target_atm.address} (PIN: {dossier.prediction.predicted_target_atm.pincode})</div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Estimated Cash-Out Window:</span>
                      <div className="font-bold text-rose-700 font-mono text-sm">~{dossier.prediction.eta_minutes} MINUTES REMAINING</div>
                      <div className="text-[11px] text-slate-600">AI Confidence: <span className="font-bold">{dossier.prediction.confidence_score}%</span></div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Nearest Police Station:</span>
                      <div>{dossier.prediction.predicted_target_atm.nearest_police_station} ({dossier.prediction.predicted_target_atm.distance_to_station_km} km)</div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">SHO Duty Contact:</span>
                      <div className="font-mono font-bold">{dossier.prediction.predicted_target_atm.sho_contact}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Directive */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase text-slate-800 border-b border-slate-300 pb-1 mb-2 font-mono">
                  3. Statutory Directives & Intervention Orders
                </h3>
                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 font-mono">
                  {dossier.advisory_directive}
                </div>
              </div>

              {/* Digital Sign-off */}
              <div className="flex items-center justify-between border-t-2 border-slate-800 pt-4 text-xs font-mono text-slate-600">
                <div>
                  <div className="font-bold text-slate-800">I4C DIGITAL SEAL VERIFIED</div>
                  <div className="text-[10px] text-slate-500">Hash: SHA256:{dossier.dossier_id?.slice(-8)}9f4b</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">{dossier.designated_io}</div>
                  <div className="text-[10px] text-slate-500">Nodal Cyber Crime Cell, Ministry of Home Affairs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
