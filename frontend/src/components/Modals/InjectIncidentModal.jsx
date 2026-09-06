import React, { useState } from 'react';
import { 
  X, Zap, Shield, AlertTriangle, Building, 
  IndianRupee, User, MapPin, Send, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

const CRIME_PRESETS = [
  {
    category: "Digital Arrest / Fake Police CBI",
    amount: 1850000,
    victimBank: "HDFC Bank",
    muleBank: "State Bank of India",
    city: "Gurugram",
    state: "Haryana",
    name: "Col. Sanjeev Bakshi (Retd.)"
  },
  {
    category: "Stock Trading / Investment Fraud",
    amount: 3500000,
    victimBank: "ICICI Bank",
    muleBank: "Axis Bank",
    city: "Surat",
    state: "Gujarat",
    name: "Dinesh Bhai Patel"
  },
  {
    category: "Task / Work from Home Scam",
    amount: 280000,
    victimBank: "State Bank of India",
    muleBank: "Airtel Payments Bank",
    city: "New Delhi",
    state: "Delhi",
    name: "Pooja Malhotra"
  },
  {
    category: "KYC Update / Bank Phishing",
    amount: 145000,
    victimBank: "Punjab National Bank",
    muleBank: "Bank of India",
    city: "Ranchi",
    state: "Jharkhand",
    name: "Rameshwar Prasad"
  }
];

export default function InjectIncidentModal({ isOpen, onClose, onIncidentInjected }) {
  const [formData, setFormData] = useState({
    complainant_name: "Col. Sanjeev Bakshi (Retd.)",
    city: "Gurugram",
    state: "Haryana",
    crime_category: "Digital Arrest / Fake Police CBI",
    fraud_amount: 1850000,
    victim_bank: "HDFC Bank",
    mule_bank: "State Bank of India"
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const applyPreset = (preset) => {
    setFormData({
      complainant_name: preset.name,
      city: preset.city,
      state: preset.state,
      crime_category: preset.category,
      fraud_amount: preset.amount,
      victim_bank: preset.victimBank,
      mule_bank: preset.muleBank
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.injectIncident(formData);
      setSubmitting(false);
      onIncidentInjected(res);
      onClose();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-900">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                SIMULATE CYBER FRAUD INCIDENT
              </h2>
              <p className="text-xs text-slate-500">
                Test AI Cash-Out location forecasting & automated LEA/Bank alert trigger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Quick Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              TEST SCENARIO PRESETS:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CRIME_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="font-semibold text-slate-900 truncate">{p.category}</div>
                  <div className="text-[11px] text-blue-900 font-mono font-bold">₹{p.amount.toLocaleString()} • {p.city}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Crime Category */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              CRIME CATEGORY
            </label>
            <select
              value={formData.crime_category}
              onChange={(e) => setFormData({ ...formData, crime_category: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700 font-medium"
            >
              <option value="Digital Arrest / Fake Police CBI">Digital Arrest / Fake Police CBI</option>
              <option value="Stock Trading / Investment Fraud">Stock Trading / Investment Fraud</option>
              <option value="Task / Work from Home Scam">Task / Work from Home Scam</option>
              <option value="Loan App Harassment & Blackmail">Loan App Harassment & Blackmail</option>
              <option value="KYC Update / Bank Phishing">KYC Update / Bank Phishing</option>
              <option value="Sextortion / Video Call Blackmail">Sextortion / Video Call Blackmail</option>
            </select>
          </div>

          {/* Amount & Complainant Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                FRAUD AMOUNT (INR ₹)
              </label>
              <input
                type="number"
                value={formData.fraud_amount}
                onChange={(e) => setFormData({ ...formData, fraud_amount: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-red-700 font-bold font-mono focus:outline-none focus:border-blue-700"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                COMPLAINANT NAME
              </label>
              <input
                type="text"
                value={formData.complainant_name}
                onChange={(e) => setFormData({ ...formData, complainant_name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700 font-medium"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                COMPLAINANT CITY
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700 font-medium"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                STATE
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700 font-medium"
                required
              />
            </div>
          </div>

          {/* Banks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                VICTIM BANK
              </label>
              <input
                type="text"
                value={formData.victim_bank}
                onChange={(e) => setFormData({ ...formData, victim_bank: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700 font-medium"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                PRIMARY MULE BANK
              </label>
              <input
                type="text"
                value={formData.mule_bank}
                onChange={(e) => setFormData({ ...formData, mule_bank: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700 font-medium"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Spatio-Temporal AI Prediction...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Forecast Likely Cash-Out ATM & Trigger Proactive Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
