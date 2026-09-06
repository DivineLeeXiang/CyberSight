import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import TacticalGISMap from './components/Heatmap/TacticalGISMap';
import PredictiveCashoutFeed from './components/Feed/PredictiveCashoutFeed';
import MoneyLayeringGraph from './components/Graph/MoneyLayeringGraph';
import AlertsDrawer from './components/Alerts/AlertsDrawer';
import InjectIncidentModal from './components/Modals/InjectIncidentModal';
import DossierModal from './components/Modals/DossierModal';
import HelpGuideModal from './components/Modals/HelpGuideModal';
import LoginPage from './components/Auth/LoginPage';
import { I4CCommandView, FieldBeatOfficerView, BankNodalView } from './components/Roles/RoleViews';
import { api, CyberNetraWebSocket } from './services/api';
import { 
  ShieldAlert, Activity, CheckCircle, Radio, 
  Layers, Bell, RefreshCw, Zap, LogOut, User
} from 'lucide-react';

export default function App() {
  // Auth — restore from sessionStorage on mount
  const storedUser = (() => {
    try { return JSON.parse(sessionStorage.getItem('cybernetra_user')); } catch { return null; }
  })();
  const [currentUser, setCurrentUser] = useState(storedUser);

  const [status, setStatus] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [atms, setAtms] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  const [activeRole, setActiveRole] = useState(storedUser?.role || 'i4c'); // 'i4c', 'lea', 'beat', 'bank'
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Modals
  const [isInjectModalOpen, setIsInjectModalOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [graphComplaintId, setGraphComplaintId] = useState(null);
  const [dossierComplaintId, setDossierComplaintId] = useState(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Audio Chime using Web Audio API (Zero external audio assets)
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted before first click
    }
  };

  // Initial Data Fetch
  const loadData = async () => {
    try {
      const [statusRes, hotspotsRes, atmsRes, predsRes, alertsRes] = await Promise.all([
        api.getStatus(),
        api.getHotspots(),
        api.getAtms(),
        api.getActivePredictions(),
        api.getAlerts()
      ]);

      setStatus(statusRes);
      setHotspots(hotspotsRes.hotspots || []);
      setAtms(atmsRes.atms || []);
      setPredictions(predsRes.predictions || []);
      setAlerts(alertsRes.alerts || []);
      
      if (predsRes.predictions && predsRes.predictions.length > 0 && !selectedPrediction) {
        setSelectedPrediction(predsRes.predictions[0]);
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  useEffect(() => {
    loadData();

    // Setup WebSocket
    const ws = new CyberNetraWebSocket(
      (message) => {
        if (message.type === 'NEW_COMPLAINT_AND_PREDICTION') {
          setPredictions((prev) => [message.prediction, ...prev]);
          if (message.alerts) {
            setAlerts((prev) => [...message.alerts, ...prev]);
          }
          setSelectedPrediction(message.prediction);
          showToast(`🚨 NEW CASH-OUT FORECAST: ${message.prediction.predicted_target_atm.name} (~${message.prediction.eta_minutes}m)`);
          playAlertChime();
          // Refresh status & atms
          api.getStatus().then(setStatus);
          api.getAtms().then((res) => setAtms(res.atms || []));
        } else if (message.type === 'PREDICTION_UPDATED') {
          setPredictions((prev) =>
            prev.map((p) => (p.id === message.data.id ? message.data : p))
          );
          if (message.alert) {
            setAlerts((prev) => [message.alert, ...prev]);
          }
          showToast(`🚓 DISPATCH CONFIRMED: Unit en route to ${message.data.predicted_target_atm.name}`);
        } else if (message.type === 'ACCOUNT_FROZEN') {
          setPredictions((prev) =>
            prev.map((p) => (p.id === message.data.id ? message.data : p))
          );
          if (message.alert) {
            setAlerts((prev) => [message.alert, ...prev]);
          }
          showToast(`🔒 CFCFRMS FREEZE PLACED: Stolen funds secured!`);
        }
      },
      (connected) => setWsConnected(connected)
    );

    return () => ws.disconnect();
  }, [soundEnabled]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleDispatch = async (pred) => {
    try {
      await api.dispatchUnit({
        prediction_id: pred.id,
        unit_id: "PCR-DELHI-402",
        officer_name: "SI Amit Hooda",
        priority: "CRITICAL",
        notes: "Immediate intercept at ATM kiosk; suspect runner expected on motorcycle."
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFreeze = async (pred) => {
    try {
      await api.freezeAccount({
        complaint_id: pred.complaint_id,
        account_number: pred.complaint_id.slice(-8) + "4920",
        ifsc: pred.predicted_target_atm.bank === "State Bank of India" ? "SBIN0001042" : "HDFC0001200",
        bank_name: pred.predicted_target_atm.bank,
        freeze_amount: pred.predicted_amount_to_withdraw,
        action_type: "TOTAL_FREEZE"
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncidentInjected = (res) => {
    if (res.prediction) {
      setSelectedPrediction(res.prediction);
      loadData();
      showToast(`⚡ Incident Injected: Targeted ${res.prediction.predicted_target_atm.name}`);
      playAlertChime();
    }
  };

  // CSV Export for Government Reports
  const handleExportCSV = () => {
    if (!predictions || predictions.length === 0) return;

    const headers = [
      "NCRP_Ack_ID",
      "Crime_Category",
      "Targeted_ATM",
      "Bank",
      "Pin_Code",
      "District",
      "State",
      "Amount_At_Risk_INR",
      "ETA_Minutes",
      "AI_Confidence_Pct",
      "Risk_Level",
      "Intervention_Status",
      "Nearest_Police_Station",
      "SHO_Contact"
    ];

    const rows = predictions.map((p) => [
      `"${p.complaint_id}"`,
      `"${p.predicted_target_atm?.atm_type || 'ATM'}"`,
      `"${p.predicted_target_atm?.name || ''}"`,
      `"${p.predicted_target_atm?.bank || ''}"`,
      `"${p.predicted_target_atm?.pincode || ''}"`,
      `"${p.predicted_target_atm?.district || ''}"`,
      `"${p.predicted_target_atm?.state || ''}"`,
      p.predicted_amount_to_withdraw || 0,
      p.eta_minutes || 0,
      p.confidence_score || 0,
      `"${p.risk_level}"`,
      `"${p.intervention_status}"`,
      `"${p.predicted_target_atm?.nearest_police_station || ''}"`,
      `"${p.predicted_target_atm?.sho_contact || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `I4C_CyberNetra_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Government Navbar */}
      <Navbar
        status={status}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onOpenInjectModal={() => setIsInjectModalOpen(true)}
        onToggleAlerts={() => setIsAlertsOpen(!isAlertsOpen)}
        unreadAlertCount={alerts.length}
        wsConnected={wsConnected}
        onExportCSV={handleExportCSV}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Real-time Toast Banner */}
      {toastMessage && (
        <div className="bg-blue-900 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md sticky top-[76px] z-40 border-b border-blue-800">
          <div className="flex items-center gap-2 max-w-[1720px] mx-auto w-full">
            <Radio className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 space-y-6">
        {/* VIEW 1 & 2: I4C National Command or District Cyber Cell */}
        {(activeRole === 'i4c' || activeRole === 'lea') && (
          <div className="space-y-6">
            {/* Top Grid: GIS Heatmap + Predictive Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TacticalGISMap
                  hotspots={hotspots}
                  atms={atms}
                  predictions={predictions}
                  selectedPrediction={selectedPrediction}
                  onSelectPrediction={setSelectedPrediction}
                  onDispatch={handleDispatch}
                  onFreeze={handleFreeze}
                  onViewGraph={(cid) => setGraphComplaintId(cid)}
                />
              </div>
              <div className="lg:col-span-1">
                <PredictiveCashoutFeed
                  predictions={predictions}
                  selectedPrediction={selectedPrediction}
                  onSelectPrediction={setSelectedPrediction}
                  onDispatch={handleDispatch}
                  onFreeze={handleFreeze}
                  onViewDossier={(cid) => setDossierComplaintId(cid)}
                  onViewGraph={(cid) => setGraphComplaintId(cid)}
                />
              </div>
            </div>

            {/* Bottom View: I4C Analytics */}
            {activeRole === 'i4c' && (
              <I4CCommandView
                status={status}
                hotspots={hotspots}
                predictions={predictions}
                onViewDossier={(cid) => setDossierComplaintId(cid)}
              />
            )}
          </div>
        )}

        {/* VIEW 3: Field Beat Officer View */}
        {activeRole === 'beat' && (
          <FieldBeatOfficerView
            predictions={predictions}
            onDispatch={handleDispatch}
          />
        )}

        {/* VIEW 4: CFCFRMS Bank Nodal Officer View */}
        {activeRole === 'bank' && (
          <BankNodalView
            predictions={predictions}
            onFreeze={handleFreeze}
          />
        )}
      </main>

      {/* Official Government Footer */}
      <footer className="border-t border-slate-300 bg-white py-4 px-6 mt-8 text-xs text-slate-600 font-medium flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1720px] mx-auto w-full">
        <div>
          CYBER-NETRA v2.0 • Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs, Government of India
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span>NCRP Integration: VERIFIED</span>
          <span>CFCFRMS 1930 Helpline: ONLINE</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MoneyLayeringGraph
        complaintId={graphComplaintId}
        onClose={() => setGraphComplaintId(null)}
      />

      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
      />

      <InjectIncidentModal
        isOpen={isInjectModalOpen}
        onClose={() => setIsInjectModalOpen(false)}
        onIncidentInjected={handleIncidentInjected}
      />

      <DossierModal
        complaintId={dossierComplaintId}
        onClose={() => setDossierComplaintId(null)}
      />
    </div>
  );
}
