import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, MapPin, Eye, ShieldAlert, Crosshair, 
  Clock, Filter, ShieldCheck, Zap, Navigation
} from 'lucide-react';

export default function TacticalGISMap({ 
  hotspots = [], 
  atms = [], 
  predictions = [], 
  selectedPrediction, 
  onSelectPrediction, 
  onDispatch, 
  onFreeze,
  onViewGraph 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({
    hotspots: L.layerGroup(),
    atms: L.layerGroup(),
    activeThreats: L.layerGroup()
  });

  const [timeHorizon, setTimeHorizon] = useState('now'); // 'now', '+30m', '+2h', '24h'
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [showHotspots, setShowHotspots] = useState(true);
  const [showAtms, setShowAtms] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on India
    const map = L.map(mapContainerRef.current, {
      center: [24.5, 78.9],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false
    });

    // Crisp, clean government GIS tiles (OpenStreetMap - Zero Watermark)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | I4C CYBERSIGHT',
      maxZoom: 19
    }).addTo(map);

    // Zoom control on top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add layer groups
    layerGroupsRef.current.hotspots.addTo(map);
    layerGroupsRef.current.atms.addTo(map);
    layerGroupsRef.current.activeThreats.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when data or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { hotspots: hsGroup, atms: atmGroup, activeThreats: threatGroup } = layerGroupsRef.current;
    hsGroup.clearLayers();
    atmGroup.clearLayers();
    threatGroup.clearLayers();

    // 1. Render Hotspot Risk Zones
    if (showHotspots && hotspots.length > 0) {
      hotspots.forEach((hs) => {
        const radiusMeters = (hs.radius_km || 20) * 1000;
        const intensity = hs.mule_density_index || 80;
        const strokeColor = intensity > 90 ? '#dc2626' : (intensity > 85 ? '#ea580c' : '#ca8a04');

        const circle = L.circle([hs.center_lat, hs.center_lng], {
          radius: radiusMeters,
          color: strokeColor,
          weight: 2,
          opacity: 0.8,
          fillColor: strokeColor,
          fillOpacity: timeHorizon === '+30m' ? 0.20 : 0.12,
          dashArray: '5, 5'
        });

        circle.bindTooltip(`
          <div class="p-1.5 font-sans">
            <div class="font-bold text-xs text-slate-900">${hs.name}</div>
            <div class="text-[11px] text-slate-600">State: <span class="font-semibold text-slate-800">${hs.state} (${hs.district})</span></div>
            <div class="text-[11px] text-slate-600">Mule Density Index: <span class="font-mono text-red-700 font-bold">${hs.mule_density_index}</span></div>
            <div class="text-[11px] text-slate-500">Historical Incidents: ${hs.historical_cashout_count}</div>
          </div>
        `, { sticky: true, className: 'leaflet-tactical-tooltip' });

        hsGroup.addLayer(circle);
      });
    }

    // 2. Render Active Predictions & Targeted ATMs
    const filteredPredictions = predictions.filter((p) => {
      if (filterRisk !== 'ALL' && p.risk_level !== filterRisk) return false;
      return true;
    });

    const predAtmMap = new Map();
    filteredPredictions.forEach((p) => {
      predAtmMap.set(p.predicted_target_atm.id, p);
    });

    if (showAtms) {
      atms.forEach((atm) => {
        const activePred = predAtmMap.get(atm.id);

        if (activePred) {
          const isCritical = activePred.risk_level === 'CRITICAL';
          const pulseColor = isCritical ? '#dc2626' : '#d97706';
          const bgBadge = isCritical ? 'bg-red-600' : 'bg-amber-600';

          const customIcon = L.divIcon({
            className: 'custom-radar-icon',
            html: `
              <div class="relative flex items-center justify-center w-8 h-8">
                <div class="absolute w-8 h-8 rounded-full ${bgBadge} opacity-40 radar-ping-fast"></div>
                <div class="absolute w-5 h-5 rounded-full ${bgBadge} opacity-60 radar-ping"></div>
                <div class="relative w-4 h-4 rounded-full ${bgBadge} border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-md">
                  !
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker([atm.latitude, atm.longitude], { icon: customIcon });

          const popupContent = document.createElement('div');
          popupContent.className = 'tactical-popup p-3 min-w-[280px] font-sans text-slate-900';
          popupContent.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isCritical ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                ${activePred.risk_level} THREAT
              </span>
              <span class="text-xs font-mono font-bold text-red-700">
                ETA: ~${activePred.eta_minutes} mins
              </span>
            </div>
            
            <div class="text-sm font-bold text-slate-900 mb-0.5">${atm.name}</div>
            <div class="text-[11px] text-slate-600 mb-2">${atm.address} (PIN: ${atm.pincode})</div>
            
            <div class="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded border border-slate-200 text-[11px] mb-3">
              <div>
                <span class="text-slate-500 text-[10px] block">CRIME ACK</span>
                <span class="text-slate-800 font-semibold truncate block">${activePred.complaint_id}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">AMOUNT AT RISK</span>
                <span class="text-red-700 font-bold font-mono">₹${activePred.predicted_amount_to_withdraw.toLocaleString()}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">AI CONFIDENCE</span>
                <span class="text-emerald-700 font-mono font-bold">${activePred.confidence_score}%</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">NEAREST PS</span>
                <span class="text-slate-700 font-medium truncate block">${atm.nearest_police_station}</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <button id="btn-dispatch-${activePred.id}" class="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm">
                🚨 Dispatch PCR
              </button>
              <button id="btn-freeze-${activePred.id}" class="flex-1 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm">
                🔒 Freeze CFCFRMS
              </button>
              <button id="btn-graph-${activePred.id}" class="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold p-1.5 rounded transition-all cursor-pointer" title="View Money Trail Graph">
                🕸️
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on('popupopen', () => {
            const btnDisp = document.getElementById(`btn-dispatch-${activePred.id}`);
            const btnFrz = document.getElementById(`btn-freeze-${activePred.id}`);
            const btnGrph = document.getElementById(`btn-graph-${activePred.id}`);

            if (btnDisp) btnDisp.onclick = () => onDispatch(activePred);
            if (btnFrz) btnFrz.onclick = () => onFreeze(activePred);
            if (btnGrph) btnGrph.onclick = () => onViewGraph(activePred.complaint_id);
          });

          threatGroup.addLayer(marker);

          // Threat radius circle
          const riskCircle = L.circle([atm.latitude, atm.longitude], {
            radius: (activePred.spatial_radius_km || 3.0) * 1000,
            color: pulseColor,
            weight: 1.5,
            opacity: 0.8,
            fillColor: pulseColor,
            fillOpacity: 0.10
          });
          threatGroup.addLayer(riskCircle);

        } else {
          // Standard Monitored ATM Pin
          const atmIcon = L.divIcon({
            className: 'custom-atm-icon',
            html: `
              <div class="w-3 h-3 rounded-full bg-blue-900 border-2 border-white hover:bg-blue-700 transition-colors shadow-sm"></div>
            `,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });

          const atmMarker = L.marker([atm.latitude, atm.longitude], { icon: atmIcon });
          atmMarker.bindTooltip(`
            <div class="p-1 font-sans">
              <div class="font-bold text-xs text-slate-900">${atm.name}</div>
              <div class="text-[10px] text-slate-600">${atm.bank} • ${atm.atm_type}</div>
              <div class="text-[10px] text-slate-500">Vulnerability Index: <span class="font-mono text-blue-800 font-bold">${atm.vulnerability_score}</span></div>
            </div>
          `, { sticky: true, className: 'leaflet-tactical-tooltip' });

          atmGroup.addLayer(atmMarker);
        }
      });
    }
  }, [hotspots, atms, predictions, timeHorizon, filterRisk, showHotspots, showAtms]);

  useEffect(() => {
    if (selectedPrediction && mapInstanceRef.current) {
      const atm = selectedPrediction.predicted_target_atm;
      mapInstanceRef.current.flyTo([atm.latitude, atm.longitude], 13, {
        duration: 1.5
      });
    }
  }, [selectedPrediction]);

  const flyToHub = (lat, lng, zoom = 11) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-[580px] lg:h-[680px] rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shadow-sm">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-lg border border-slate-300 shadow-md max-w-[90%]">
        {/* Time Horizon Slider Tabs */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-300 text-[11px] font-mono">
          <span className="text-slate-600 px-2 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-slate-500" /> HORIZON:
          </span>
          {[
            { id: 'now', label: 'NOW (Live)' },
            { id: '+30m', label: '+30m Forecast' },
            { id: '+2h', label: '+2h Forecast' },
            { id: '24h', label: 'Past 24h' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeHorizon(t.id)}
              className={`px-2 py-0.5 rounded transition-colors font-semibold cursor-pointer ${
                timeHorizon === t.id
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Threat Level Filter */}
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 text-xs font-medium focus:outline-none focus:border-blue-700"
        >
          <option value="ALL">All Threat Levels</option>
          <option value="CRITICAL">Critical (&lt;30m ETA)</option>
          <option value="HIGH">High (30-90m ETA)</option>
          <option value="ELEVATED">Elevated</option>
        </select>

        {/* Toggle Layers */}
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`px-2 py-1 rounded text-xs border flex items-center gap-1 transition-all cursor-pointer font-medium ${
            showHotspots
              ? 'bg-red-50 border-red-300 text-red-800'
              : 'bg-white border-slate-300 text-slate-600'
          }`}
        >
          <Layers className="w-3 h-3" />
          Hotspots
        </button>

        <button
          onClick={() => setShowAtms(!showAtms)}
          className={`px-2 py-1 rounded text-xs border flex items-center gap-1 transition-all cursor-pointer font-medium ${
            showAtms
              ? 'bg-blue-50 border-blue-300 text-blue-900'
              : 'bg-white border-slate-300 text-slate-600'
          }`}
        >
          <MapPin className="w-3 h-3" />
          ATMs / CSPs
        </button>
      </div>

      {/* Bottom Floating Tactical Sector Jump Bar */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-300 shadow-md text-xs">
        <span className="text-slate-600 text-[11px] font-semibold flex items-center gap-1 mr-1">
          <Navigation className="w-3 h-3 text-blue-900" /> SECTOR JUMP:
        </span>
        <button
          onClick={() => flyToHub(28.1065, 77.0112, 11)}
          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-medium cursor-pointer"
        >
          Mewat-Nuh
        </button>
        <button
          onClick={() => flyToHub(23.9598, 86.8016, 11)}
          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-medium cursor-pointer"
        >
          Jamtara
        </button>
        <button
          onClick={() => flyToHub(21.1702, 72.8311, 11)}
          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-medium cursor-pointer"
        >
          Surat
        </button>
        <button
          onClick={() => flyToHub(27.2152, 77.5030, 11)}
          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-medium cursor-pointer"
        >
          Bharatpur/Deeg
        </button>
        <button
          onClick={() => flyToHub(28.4595, 77.0266, 11)}
          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-medium cursor-pointer"
        >
          Gurugram
        </button>
        <button
          onClick={() => flyToHub(28.5921, 77.0460, 11)}
          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-medium cursor-pointer"
        >
          Delhi NCR
        </button>
        <button
          onClick={() => flyToHub(24.5, 78.9, 5)}
          className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold cursor-pointer"
        >
          All India
        </button>
      </div>

      {/* Legend on Bottom-Right */}
      <div className="hidden sm:block absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-300 text-[11px] font-sans shadow-md">
        <div className="font-bold text-slate-900 mb-1.5 text-xs">GIS MAP LEGEND</div>
        <div className="space-y-1 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="font-medium text-red-900">Targeted ATM (&lt;30m ETA)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>High Risk Watch (30-90m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 border border-dashed border-red-500 bg-red-100"></span>
            <span>Mule Syndicate Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-900"></span>
            <span>Monitored ATM / CSP Kiosk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
