import React from 'react';
import { 
  Bell, X, MessageSquare, Smartphone, Webhook, 
  CheckCircle2, Clock, MapPin, ExternalLink, ShieldAlert
} from 'lucide-react';

export default function AlertsDrawer({ isOpen, onClose, alerts = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border-l border-slate-300 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading">
                REAL-TIME ALERT & DISPATCH FEED
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                SMS • WhatsApp • CFCFRMS Bank API Webhooks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Alerts */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              No alert dispatches in queue.
            </div>
          ) : (
            alerts.map((alert) => {
              const isSms = alert.channel === 'SMS_BEAT_OFFICER';
              const isWa = alert.channel === 'WHATSAPP_LEA';
              const isWebhook = alert.channel === 'CFCFRMS_API_WEBHOOK';

              return (
                <div
                  key={alert.id}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all font-mono shadow-xs"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase border flex items-center gap-1 ${
                      isSms
                        ? 'bg-blue-100 text-blue-900 border-blue-200'
                        : isWa
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                        : 'bg-purple-100 text-purple-900 border-purple-200'
                    }`}>
                      {isSms && <Smartphone className="w-3 h-3" />}
                      {isWa && <MessageSquare className="w-3 h-3" />}
                      {isWebhook && <Webhook className="w-3 h-3" />}
                      {alert.channel.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-500">{alert.timestamp}</span>
                  </div>

                  {/* Recipient */}
                  <div className="text-xs font-semibold text-slate-800 mb-1">
                    To: <span className="text-slate-900 font-bold">{alert.recipient}</span>
                  </div>

                  {/* Message Body */}
                  <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 mb-2 leading-relaxed whitespace-pre-wrap font-sans">
                    {alert.message}
                  </div>

                  {/* Status & ID */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{alert.id}</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {alert.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-600 text-center font-medium">
          Automated multi-jurisdiction notification gateway (I4C-CFCFRMS-LEA)
        </div>
      </div>
    </div>
  );
}
