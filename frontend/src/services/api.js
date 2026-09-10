const API_BASE = "http://127.0.0.1:8000/api";
const WS_BASE = "ws://127.0.0.1:8000/ws";

export const api = {
  async getStatus() {
    const res = await fetch(`${API_BASE}/status`);
    return res.json();
  },

  async getHotspots() {
    const res = await fetch(`${API_BASE}/hotspots`);
    return res.json();
  },

  async getAtms() {
    const res = await fetch(`${API_BASE}/atms`);
    return res.json();
  },

  async getComplaints(limit = 50) {
    const res = await fetch(`${API_BASE}/complaints?limit=${limit}`);
    return res.json();
  },

  async getActivePredictions() {
    const res = await fetch(`${API_BASE}/predictions/active`);
    return res.json();
  },

  async getComplaintGraph(complaintId) {
    const res = await fetch(`${API_BASE}/graph/${encodeURIComponent(complaintId)}`);
    return res.json();
  },

  async dispatchUnit(payload) {
    const res = await fetch(`${API_BASE}/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async freezeAccount(payload) {
    const res = await fetch(`${API_BASE}/freeze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async injectIncident(payload) {
    const res = await fetch(`${API_BASE}/simulate/inject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getAlerts(limit = 40) {
    const res = await fetch(`${API_BASE}/alerts?limit=${limit}`);
    return res.json();
  },

  async getDossier(complaintId) {
    const res = await fetch(`${API_BASE}/dossier/${encodeURIComponent(complaintId)}`);
    return res.json();
  }
};

export class CyberNetraWebSocket {
  constructor(onMessage, onStatusChange) {
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
    this.ws = null;
    this.reconnectTimer = null;
    this.connect();
  }

  connect() {
    try {
      this.ws = new WebSocket(WS_BASE);
      
      this.ws.onopen = () => {
        if (this.onStatusChange) this.onStatusChange(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.onMessage) this.onMessage(data);
        } catch (e) {
          console.error("Error parsing WS message", e);
        }
      };

      this.ws.onclose = () => {
        // Test if HTTP API is alive before showing offline
        fetch(`${API_BASE}/status`)
          .then(res => res.ok ? this.onStatusChange && this.onStatusChange(true) : this.onStatusChange && this.onStatusChange(false))
          .catch(() => this.onStatusChange && this.onStatusChange(false));
        this.reconnect();
      };

      this.ws.onerror = () => {
        fetch(`${API_BASE}/status`)
          .then(res => res.ok ? this.onStatusChange && this.onStatusChange(true) : null)
          .catch(() => null);
        this.ws.close();
      };
    } catch (err) {
      this.reconnect();
    }
  }

  reconnect() {
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 3000);
  }

  disconnect() {
    clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
    }
  }
}
