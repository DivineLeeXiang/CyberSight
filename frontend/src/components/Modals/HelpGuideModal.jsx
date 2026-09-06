import React, { useState } from 'react';
import { 
  X, BookOpen, Shield, Clock, MapPin, Building2, 
  Car, FileText, CheckCircle2, AlertTriangle, Key, HelpCircle, Eye
} from 'lucide-react';

export default function HelpGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('sop'); // 'sop', 'roles', 'features', 'legal', 'security'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-900">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                CYBER-NETRA | USER MANUAL & STANDARD OPERATING PROCEDURE (SOP)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Official Law Enforcement & Banking Coordination Field Guide
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 text-xs font-semibold">
          {[
            { id: 'sop', label: '1. Standard Operating Procedure (SOP)' },
            { id: 'features', label: '2. Platform Features & Heatmap' },
            { id: 'roles', label: '3. Multi-Agency Role Guide' },
            { id: 'legal', label: '4. Legal & Statutory Directives' },
            { id: 'security', label: '5. Security & Compliance (DPDP/CERT-In)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-900 text-blue-900 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-4">
          {/* TAB 1: SOP */}
          {activeTab === 'sop' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-blue-900 mb-1">
                  How the Proactive Cybercrime Cash-Out Pipeline Works
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Traditional police responses act after an FIR is filed (often hours or days after the crime), by which time cash-out runners have extracted cash from ATMs. CYBER-NETRA enforces an automated 5-step proactive pipeline:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-sans">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-xs font-bold text-blue-900 mb-1">STEP 1: INGESTION</div>
                  <p className="text-[11px] text-slate-600">
                    Complaints arriving on 1930 / cybercrime.gov.in are ingested with victim bank, mule beneficiary IFSC, and amount.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-xs font-bold text-blue-900 mb-1">STEP 2: AI FORECAST</div>
                  <p className="text-[11px] text-slate-600">
                    Spatio-temporal Gaussian models & mule syndicate heuristics calculate likely ATM cluster and ETA countdown (~15–45m).
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-xs font-bold text-blue-900 mb-1">STEP 3: DISPATCH</div>
                  <p className="text-[11px] text-slate-600">
                    PCR van / Beat Unit is alerted with turn-by-turn GPS navigation and runner profile for physical interdiction.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-xs font-bold text-blue-900 mb-1">STEP 4: BANK FREEZE</div>
                  <p className="text-[11px] text-slate-600">
                    CFCFRMS bank nodal officers place immediate legal lien on Layer 1-3 accounts via automated API webhooks.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <div className="text-xs font-bold text-blue-900 mb-1">STEP 5: LEGAL DOSSIER</div>
                  <p className="text-[11px] text-slate-600">
                    Official Section 91 CrPC / Section 94 BNSS statutory notice is generated with digital hash for court trial evidence.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                  Tactical GIS Heatmap & Sector Jump
                </h4>
                <p className="text-[11px] text-slate-600">
                  Visualizes active withdrawal threat zones across India. Red pulsing circles denote ATMs targeted for withdrawal within 30 minutes. Use the <strong>Sector Jump</strong> buttons at the bottom to teleport instantly to high-risk corridors like Mewat-Nuh, Jamtara, Surat, Bharatpur, or Gurugram.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  The "Golden Hour" Countdown Timer
                </h4>
                <p className="text-[11px] text-slate-600">
                  Shows remaining time before suspect runners are projected to physically withdraw cash. Crime categories like Task scams cash out in ~25 minutes, whereas high-value Digital Arrest scams split into multiple tranches taking ~40–60 minutes.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Forensic Money Layering Graph
                </h4>
                <p className="text-[11px] text-slate-600">
                  Click the graph icon (🕸️) on any incident card to view the directed money flow from Victim Account $\to$ Layer 1 Mule $\to$ Layer 2 Mule $\to$ Forecasted ATM Node.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <Shield className="w-4 h-4" /> 1. I4C Apex Command View
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Designed for Ministry of Home Affairs and I4C Directors. Displays national macro statistics, interstate syndicate correlations, and total funds saved across state police forces.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <Shield className="w-4 h-4" /> 2. District Cyber Cell (LEA)
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Designed for SPs, DSPs, and Cyber Cell SHOs. Enables local investigation management, 1-click police dispatch, and Section 91 notice generation.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <Car className="w-4 h-4" /> 3. Field Beat Units (Mobile Desk)
                  </div>
                  <p className="text-[11px] text-slate-600">
                    High-contrast mobile interface for officers in patrol cars. Provides instant GPS routing to the targeted ATM and tactical tips on runner appearance and modus operandi.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <Building2 className="w-4 h-4" /> 4. CFCFRMS Bank Nodal Officer
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Tabular feed for bank compliance officers (SBI, HDFC, ICICI, etc.) with 1-click legally binding account freezes before ATM dispense.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL */}
          {activeTab === 'legal' && (
            <div className="space-y-3 font-mono text-[11px]">
              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-900 text-xs mb-1">
                  1. Section 91 Code of Criminal Procedure, 1973 (CrPC)
                </div>
                <p className="text-slate-600">
                  Empowers police officers to summon documents or digital records from banks, telcos, and payment gateways necessary for criminal investigation.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-900 text-xs mb-1">
                  2. Section 94 Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)
                </div>
                <p className="text-slate-600">
                  Statutory provision under India's new criminal code authorizing electronic transmission and legal recognition of proactive freeze orders.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg">
                <div className="font-bold text-slate-900 text-xs mb-1">
                  3. Section 69B Information Technology Act, 2000
                </div>
                <p className="text-slate-600">
                  Authorizes real-time monitoring and collection of cyber traffic data for cyber threat mitigation and cyber fraud containment.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-blue-900" />
                  Digital Personal Data Protection (DPDP) Act 2023 Compliance
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  All citizen financial information and victim PII are pseudonymized. Account numbers are masked (e.g. `XXXX-XXXX-4920`) in regular views and accessible only with authenticated Law Enforcement credentials.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-900" />
                  CERT-In & Cyber Security Guidelines
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The framework enforces Role-Based Access Control (RBAC), end-to-end TLS 1.3 encryption, immutable audit trails for every police dispatch and bank freeze, and IP whitelisting for LEA control rooms.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span>Need further assistance? Contact I4C Technical Operations: support@cybercrime.gov.in</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-semibold transition-colors cursor-pointer shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
