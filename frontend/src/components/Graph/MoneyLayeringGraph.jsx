import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, AlertCircle, Building2, 
  CreditCard, MapPin, User, X, CheckCircle, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export default function MoneyLayeringGraph({ complaintId, onClose, onFreezeAccount }) {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!complaintId) return;
    setLoading(true);
    api.getComplaintGraph(complaintId)
      .then((data) => {
        setGraphData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [complaintId]);

  if (!complaintId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                FORENSIC MONEY TRAIL
              </span>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                NCRP Ack: {complaintId}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-Layer Mule Hop Traversal & Forecasted Cash-Out Node
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 font-mono text-sm">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-900 mb-2" />
              Tracing multi-layer banking transaction graph...
            </div>
          ) : !graphData || graphData.nodes.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-mono text-sm">
              No graph data found for this complaint.
            </div>
          ) : (
            <div>
              {/* Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-lg border border-slate-200 mb-6 font-mono text-xs shadow-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block font-bold">TOTAL STOLEN</span>
                  <span className="text-red-700 font-bold text-sm">
                    ₹{graphData.summary.total_stolen?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-bold">LAYERING DEPTH</span>
                  <span className="text-amber-800 font-bold text-sm">
                    {graphData.summary.layer_depth} Mule Hops
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-bold">DISPATCH TARGET</span>
                  <span className="text-blue-900 font-bold text-sm truncate block">
                    {graphData.summary.target_atm_id || 'Active ATM Node'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-bold">ALGORITHM</span>
                  <span className="text-emerald-800 font-bold text-sm">NetworkX Directed DiGraph</span>
                </div>
              </div>

              {/* Visual Hop Flow Sequence */}
              <div className="relative py-6 px-2">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  {graphData.nodes.map((node, index) => {
                    const isVictim = node.node_type === 'VICTIM';
                    const isMule = node.node_type?.includes('MULE');
                    const isAtm = node.node_type === 'ATM_TARGET';

                    return (
                      <React.Fragment key={node.id}>
                        {/* Node Card */}
                        <div
                          onClick={() => setSelectedNode(node)}
                          className={`relative p-4 rounded-xl border transition-all cursor-pointer w-full lg:w-56 shrink-0 bg-white shadow-xs ${
                            isVictim
                              ? 'border-blue-400 ring-1 ring-blue-300'
                              : isMule
                              ? 'border-amber-400 ring-1 ring-amber-300'
                              : 'border-red-400 ring-2 ring-red-400 bg-red-50/40'
                          }`}
                        >
                          {/* Top Pill */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              isVictim
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : isMule
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-red-100 text-red-900 border border-red-300 animate-pulse'
                            }`}>
                              {isVictim ? 'VICTIM' : (isMule ? node.node_type : 'FORECASTED CASHOUT')}
                            </span>
                            {isAtm && (
                              <span className="text-[10px] font-mono text-red-700 font-bold">
                                ~{node.eta_minutes}m
                              </span>
                            )}
                          </div>

                          {/* Node Icon & Name */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-2 rounded-lg ${
                              isVictim
                                ? 'bg-blue-100 text-blue-900'
                                : isMule
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-red-100 text-red-900'
                            }`}>
                              {isVictim ? <User className="w-4 h-4" /> : (isMule ? <CreditCard className="w-4 h-4" /> : <MapPin className="w-4 h-4" />)}
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {node.label || node.id}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate font-semibold">
                                {node.bank || 'Banking Entity'}
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="bg-slate-50 p-2 rounded text-[11px] font-mono space-y-0.5 border border-slate-200">
                            {node.account && (
                              <div className="text-slate-600 text-[10px]">
                                A/C: <span className="text-slate-900 font-bold">XXXX{node.account.slice(-4)}</span>
                              </div>
                            )}
                            {node.amount && (
                              <div className="text-red-700 font-bold">
                                ₹{node.amount.toLocaleString()}
                              </div>
                            )}
                            {node.pincode && (
                              <div className="text-slate-600 text-[10px]">
                                PIN: <span className="text-slate-900 font-bold">{node.pincode}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Connection Arrow */}
                        {index < graphData.nodes.length - 1 && (
                          <div className="flex lg:flex-col items-center justify-center text-slate-400 py-1">
                            <ArrowRight className="w-5 h-5 text-blue-900 rotate-90 lg:rotate-0 shrink-0" />
                            <span className="text-[9px] font-mono text-slate-500 mt-1 block font-semibold">
                              IMPS / RTGS
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Inspector Panel for Selected Node */}
              {selectedNode && (
                <div className="mt-6 bg-white border border-slate-300 p-4 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-900" />
                      Forensic Node Metadata: {selectedNode.label || selectedNode.id}
                    </h3>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-xs text-blue-900 font-semibold hover:underline cursor-pointer"
                    >
                      Close Inspector
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">NODE TYPE</span>
                      <span className="text-slate-900 font-semibold">{selectedNode.node_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">BANK / INSTITUTION</span>
                      <span className="text-slate-900 font-semibold">{selectedNode.bank || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">ACCOUNT NUMBER</span>
                      <span className="text-slate-900 font-semibold">{selectedNode.account || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">IFSC CODE</span>
                      <span className="text-slate-900 font-semibold">{selectedNode.ifsc || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600">
          <span>I4C Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-semibold transition-colors cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
