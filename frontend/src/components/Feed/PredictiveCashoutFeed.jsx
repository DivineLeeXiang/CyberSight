import React, { useState } from 'react';
import { 
  AlertOctagon, Clock, Shield, Building, MapPin, 
  Search, FileText, CheckCircle2, ChevronRight, Share2, Lock, CheckSquare, Square, Network
} from 'lucide-react';

export default function PredictiveCashoutFeed({ 
  predictions = [], 
  selectedPrediction, 
  onSelectPrediction, 
  onDispatch, 
  onFreeze, 
  onViewDossier, 
  onViewGraph 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Filtered by search query
  const filteredPredictions = predictions.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.complaint_id.toLowerCase().includes(q) ||
      p.predicted_target_atm.name.toLowerCase().includes(q) ||
      p.predicted_target_atm.bank.toLowerCase().includes(q) ||
      p.predicted_target_atm.pincode.includes(q) ||
      p.predicted_target_atm.district.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCritical = () => {
    const criticalIds = filteredPredictions
      .filter((p) => p.risk_level === 'CRITICAL')
      .map((p) => p.id);
    setSelectedIds(criticalIds);
  };

  const handleBatchFreeze = () => {
    const toFreeze = predictions.filter((p) => selectedIds.includes(p.id));
    toFreeze.forEach((p) => onFreeze(p));
    setSelectedIds([]);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm flex flex-col h-[580px] lg:h-[680px]">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 mb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                PREDICTIVE CASH-OUT QUEUE
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-100 text-red-800 border border-red-200 font-bold">
                  {filteredPredictions.length} FORECASTS
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Golden Hour Countdown to ATM / Micro-ATM Cash-Out
              </p>
            </div>
          </div>
        </div>

        {/* Quick Search Input for High Efficiency */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Quick Search by Ack ID, ATM, Bank, Pin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-medium"
          />
        </div>

        {/* Batch Action Toolbar for Officers */}
        <div className="flex items-center justify-between text-[11px] font-sans pt-1">
          <button
            onClick={handleSelectAllCritical}
            className="text-blue-900 font-semibold hover:underline cursor-pointer flex items-center gap-1"
          >
            Select All Critical ({filteredPredictions.filter(p => p.risk_level === 'CRITICAL').length})
          </button>
          
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchFreeze}
              className="bg-purple-700 hover:bg-purple-800 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Batch Freeze ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Feed List */}
      <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
        {filteredPredictions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-mono">
            No cash-out forecasts matching your search criteria.
          </div>
        ) : (
          filteredPredictions.map((pred) => {
            const isSelected = selectedPrediction?.id === pred.id;
            const isChecked = selectedIds.includes(pred.id);
            const isCritical = pred.risk_level === 'CRITICAL';
            const atm = pred.predicted_target_atm;
            const isAverted = pred.intervention_status.includes('Frozen') || pred.intervention_status.includes('Averted');
            const isDispatched = pred.intervention_status.includes('Dispatched');

            return (
              <div
                key={pred.id}
                onClick={() => onSelectPrediction(pred)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/60 border-blue-600 shadow-sm ring-1 ring-blue-500'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                {/* Top Row: Checkbox, Risk Tag, Ack ID, ETA */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => toggleSelect(pred.id, e)}
                      className="text-slate-400 hover:text-blue-900 cursor-pointer"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-900" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                      isCritical
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {pred.risk_level}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 truncate max-w-[130px]">
                      {pred.complaint_id}
                    </span>
                  </div>

                  {/* Countdown Timer */}
                  <div className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    isCritical
                      ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>ETA ~{pred.eta_minutes}m</span>
                  </div>
                </div>

                {/* Target ATM Name & Amount */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                      <span className="truncate">{atm.name}</span>
                    </h3>
                    <p className="text-[11px] text-slate-600 truncate ml-4">
                      {atm.address} (PIN: {atm.pincode})
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 block leading-none font-medium">AMOUNT</span>
                    <span className="text-xs font-bold font-mono text-red-700">
                      ₹{pred.predicted_amount_to_withdraw?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* AI Confidence & Station Distance */}
                <div className="flex items-center justify-between bg-slate-50 px-2 py-1.5 rounded border border-slate-200 text-[10px] font-mono mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Confidence:</span>
                    <span className="text-emerald-800 font-bold">{pred.confidence_score}%</span>
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden inline-block">
                      <div
                        className="h-full bg-blue-900"
                        style={{ width: `${pred.confidence_score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-slate-500">
                    PS: <span className="text-slate-800 font-semibold">{atm.distance_to_station_km}km</span>
                  </div>
                </div>

                {/* Status Indicator if Intervened */}
                {pred.intervention_status !== 'Pending Intervention' && (
                  <div className="mb-2 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{pred.intervention_status}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDispatch(pred);
                    }}
                    disabled={isDispatched || isAverted}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-[11px] font-semibold py-1 px-2 rounded flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <Shield className="w-3 h-3" />
                    <span>{isDispatched ? 'Dispatched' : 'Dispatch PCR'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFreeze(pred);
                    }}
                    disabled={isAverted}
                    className="flex-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white text-[11px] font-semibold py-1 px-2 rounded flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <Lock className="w-3 h-3" />
                    <span>{isAverted ? 'Frozen' : 'CFCFRMS Freeze'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDossier(pred.complaint_id);
                    }}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Generate Section 91/94 Legal Intelligence Notice"
                  >
                    <FileText className="w-3 h-3 text-slate-600" />
                    <span className="hidden sm:inline">Notice</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewGraph(pred.complaint_id);
                    }}
                    className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Explore Multi-Layer Money Flow Graph"
                  >
                    <Network className="w-3 h-3 text-blue-800" />
                    <span>Trail</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
