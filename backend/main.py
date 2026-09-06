import os
import asyncio
import random
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.schemas import (
    Complaint, Prediction, ATM, ATMType, RiskLevel, InterventionStatus,
    DispatchRequest, FreezeRequest, AlertNotification, CrimeCategory, LayerHop
)
from models.predictive_engine import PredictiveAnalyticsEngine
from services.graph_forensics import GraphForensicsService
from services.alert_dispatcher import AlertDispatcherService
from services.data_generator import generate_random_complaint

app = FastAPI(
    title="CYBER-NETRA | I4C Predictive Cash-Out Intervention Platform",
    version="2.0.0",
    description="Forecasts likely cash withdrawal locations in advance from ~8,000 daily cybercrime complaints."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Engine & Services
predictive_engine = PredictiveAnalyticsEngine(DATA_DIR)
graph_service = GraphForensicsService()
alert_service = AlertDispatcherService()

# In-Memory State
complaints_db: Dict[str, Complaint] = {}
predictions_db: Dict[str, Prediction] = {}
is_streaming_simulation: bool = True
total_fraud_prevented_inr: float = 48500000.0  # ₹4.85 Crore
total_interventions_count: int = 142

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

ws_manager = ConnectionManager()

def seed_initial_data():
    """Seeds initial 15 complaints with predictions, multi-layer graphs, and alerts."""
    for i in range(15):
        complaint = generate_random_complaint()
        prediction = predictive_engine.predict_cashout(complaint)
        
        # Add to databases
        complaints_db[complaint.id] = complaint
        predictions_db[prediction.id] = prediction
        
        # Build multi-layer transaction graph
        graph_service.add_complaint_to_graph(complaint, prediction)
        
        # Dispatch alerts
        alert_service.dispatch_prediction_alert(
            prediction,
            complaint.crime_category.value,
            complaint.complainant_name
        )

# Seed on startup
seed_initial_data()

@app.get("/api/status")
def get_system_status():
    critical_count = len([p for p in predictions_db.values() if p.risk_level == RiskLevel.CRITICAL and p.intervention_status == InterventionStatus.PENDING])
    high_count = len([p for p in predictions_db.values() if p.risk_level == RiskLevel.HIGH and p.intervention_status == InterventionStatus.PENDING])
    averted_count = len([p for p in predictions_db.values() if p.intervention_status in [InterventionStatus.CASH_OUT_AVERTED, InterventionStatus.FROZEN_CFCFRMS]])
    
    return {
        "status": "ONLINE",
        "system_name": "CYBER-NETRA: I4C National Predictive Engine",
        "portal_stream_capacity": "8,000 complaints/day",
        "daily_complaints_ingested": len(complaints_db) + 7820,
        "active_predicted_cashout_hotspots": len(predictions_db),
        "critical_interventions_pending": critical_count,
        "high_priority_interventions": high_count,
        "cash_outs_averted_today": averted_count + total_interventions_count,
        "estimated_fraud_blocked_inr": total_fraud_prevented_inr,
        "is_streaming": is_streaming_simulation,
        "connected_leas": 36,
        "connected_banks": 28
    }

@app.get("/api/hotspots")
def get_hotspots():
    return {
        "hotspots": predictive_engine.hotspots,
        "total": len(predictive_engine.hotspots)
    }

@app.get("/api/atms")
def get_atms():
    # Annotate ATMs with live active threats
    atm_threat_map = {}
    for pred in predictions_db.values():
        if pred.intervention_status == InterventionStatus.PENDING:
            atm_id = pred.predicted_target_atm.id
            if atm_id not in atm_threat_map or pred.confidence_score > atm_threat_map[atm_id]["confidence"]:
                atm_threat_map[atm_id] = {
                    "threat_level": pred.risk_level.value,
                    "eta_minutes": pred.eta_minutes,
                    "confidence": pred.confidence_score,
                    "complaint_id": pred.complaint_id,
                    "amount": pred.predicted_amount_to_withdraw
                }

    annotated_atms = []
    for atm in predictive_engine.atms:
        item = atm.model_dump()
        threat = atm_threat_map.get(atm.id)
        if threat:
            item["active_threat"] = threat
        else:
            item["active_threat"] = None
        annotated_atms.append(item)

    return {
        "atms": annotated_atms,
        "total": len(annotated_atms)
    }

@app.get("/api/complaints")
def get_complaints(limit: int = 50):
    sorted_complaints = sorted(
        complaints_db.values(),
        key=lambda x: x.complaint_time,
        reverse=True
    )[:limit]
    return {"complaints": [c.model_dump() for c in sorted_complaints]}

@app.get("/api/predictions/active")
def get_active_predictions():
    # Sort with CRITICAL first, then by lowest ETA
    preds = list(predictions_db.values())
    preds.sort(key=lambda p: (
        0 if p.risk_level == RiskLevel.CRITICAL else (1 if p.risk_level == RiskLevel.HIGH else 2),
        p.eta_minutes
    ))
    return {
        "predictions": [p.model_dump() for p in preds],
        "total": len(preds)
    }

@app.get("/api/graph/{complaint_id:path}")
def get_complaint_graph(complaint_id: str):
    subgraph = graph_service.get_complaint_subgraph(complaint_id)
    return subgraph

@app.post("/api/dispatch")
async def dispatch_unit(req: DispatchRequest):
    global total_interventions_count, total_fraud_prevented_inr
    if req.prediction_id not in predictions_db:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    pred = predictions_db[req.prediction_id]
    pred.intervention_status = InterventionStatus.DISPATCHED
    pred.assigned_patrol_unit = f"{req.unit_id} (IO: {req.officer_name})"
    
    now_str = datetime.now().strftime("%H:%M:%S")
    pred.action_log.append({
        "timestamp": now_str,
        "action": "PCR / Beat Officer Dispatched",
        "details": f"Unit {req.unit_id} ({req.officer_name}) moving to {pred.predicted_target_atm.name} ({req.notes or 'Urgent Intercept'})"
    })
    
    total_interventions_count += 1
    total_fraud_prevented_inr += pred.predicted_amount_to_withdraw

    # Create dispatch alert
    alert = AlertNotification(
        id=f"ALT-DISP-{uuid.uuid4().hex[:6].upper()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        channel="SMS_BEAT_OFFICER",
        recipient=f"{req.unit_id} ({req.officer_name})",
        title="Field Intercept Orders Acknowledged",
        message=f"Unit {req.unit_id} en route to {pred.predicted_target_atm.name}. Target ETA: {pred.eta_minutes} mins.",
        severity=pred.risk_level,
        status="CONFIRMED"
    )
    alert_service.alert_history.append(alert)

    # Broadcast update via WebSocket
    await ws_manager.broadcast({
        "type": "PREDICTION_UPDATED",
        "data": pred.model_dump(),
        "alert": alert.model_dump()
    })

    return {"status": "SUCCESS", "message": "Patrol dispatched successfully", "prediction": pred.model_dump()}

@app.post("/api/freeze")
async def freeze_account(req: FreezeRequest):
    global total_fraud_prevented_inr
    matched_pred = next((p for p in predictions_db.values() if p.complaint_id == req.complaint_id), None)
    
    freeze_ref = f"CFCFRMS-{datetime.now().strftime('%Y%m%d')}-{random.randint(100000, 999999)}"
    
    if matched_pred:
        matched_pred.intervention_status = InterventionStatus.FROZEN_CFCFRMS
        matched_pred.cfcfrms_freeze_ref = freeze_ref
        matched_pred.action_log.append({
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "action": "Bank Account Frozen (CFCFRMS)",
            "details": f"Placed total lien on Account {req.account_number} ({req.bank_name}). Ref: {freeze_ref}"
        })
        total_fraud_prevented_inr += req.freeze_amount

    # Create Bank API alert
    alert = AlertNotification(
        id=f"ALT-FRZ-{uuid.uuid4().hex[:6].upper()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        channel="CFCFRMS_API_WEBHOOK",
        recipient=f"Nodal Officer {req.bank_name}",
        title="ACCOUNT FREEZE EXECUTED",
        message=f"Success: ₹{req.freeze_amount:,.0f} frozen in Acc {req.account_number} ({req.ifsc}). Ref: {freeze_ref}",
        severity=RiskLevel.HIGH,
        status="FROZEN"
    )
    alert_service.alert_history.append(alert)

    if matched_pred:
        await ws_manager.broadcast({
            "type": "ACCOUNT_FROZEN",
            "data": matched_pred.model_dump(),
            "alert": alert.model_dump()
        })

    return {
        "status": "SUCCESS",
        "freeze_ref": freeze_ref,
        "amount_frozen": req.freeze_amount,
        "account": req.account_number,
        "bank": req.bank_name
    }

class CustomIncidentInput(BaseModel):
    complainant_name: str
    city: str
    state: str
    crime_category: CrimeCategory
    fraud_amount: float
    victim_bank: str
    mule_bank: str

@app.post("/api/simulate/inject")
async def inject_custom_incident(incident: CustomIncidentInput):
    """Allows manual injection of a high-priority cybercrime complaint to test predictive pipeline."""
    cid = f"2026/NCRP/{random.randint(900000, 999999)}"
    
    # Create realistic layer hops
    v_acc = f"{random.randint(10000000000, 99999999999)}"
    l1_acc = f"{random.randint(10000000000, 99999999999)}"
    l2_acc = f"{random.randint(10000000000, 99999999999)}"
    now = datetime.now()

    hops = [
        LayerHop(
            layer=1,
            from_account=v_acc,
            from_bank=incident.victim_bank,
            to_account=l1_acc,
            to_bank="Airtel Payments Bank",
            ifsc="AIRP0001042",
            amount=incident.fraud_amount,
            utr=f"UTR{random.randint(100000000000, 999999999999)}",
            timestamp=(now - timedelta(minutes=25)).strftime("%Y-%m-%d %H:%M:%S"),
            status="Settled"
        ),
        LayerHop(
            layer=2,
            from_account=l1_acc,
            from_bank="Airtel Payments Bank",
            to_account=l2_acc,
            to_bank=incident.mule_bank,
            ifsc=f"SBIN000{random.randint(1000, 9999)}",
            amount=incident.fraud_amount * 0.95,
            utr=f"UTR{random.randint(100000000000, 999999999999)}",
            timestamp=(now - timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S"),
            status="Settled"
        )
    ]

    complaint = Complaint(
        id=cid,
        complaint_time=now.strftime("%Y-%m-%d %H:%M:%S"),
        complainant_name=incident.complainant_name,
        complainant_city=incident.city,
        complainant_state=incident.state,
        complainant_phone=f"+91 9{random.randint(100000000, 999999999)}",
        crime_category=incident.crime_category,
        fraud_amount=incident.fraud_amount,
        victim_bank=incident.victim_bank,
        victim_account=v_acc,
        layer_hops=hops,
        current_mule_account=l2_acc,
        current_mule_holder="Suspect Runner Ring",
        current_mule_bank=incident.mule_bank,
        current_mule_ifsc=hops[-1].ifsc
    )

    prediction = predictive_engine.predict_cashout(complaint)
    # Ensure injected custom incident is high priority for immediate demonstration
    prediction.risk_level = RiskLevel.CRITICAL
    prediction.eta_minutes = random.randint(14, 26)

    complaints_db[complaint.id] = complaint
    predictions_db[prediction.id] = prediction
    graph_service.add_complaint_to_graph(complaint, prediction)

    new_alerts = alert_service.dispatch_prediction_alert(
        prediction,
        complaint.crime_category.value,
        complaint.complainant_name
    )

    # Broadcast to all connected WebSockets
    await ws_manager.broadcast({
        "type": "NEW_COMPLAINT_AND_PREDICTION",
        "complaint": complaint.model_dump(),
        "prediction": prediction.model_dump(),
        "alerts": [a.model_dump() for a in new_alerts]
    })

    return {
        "status": "INJECTED_SUCCESSFULLY",
        "complaint": complaint.model_dump(),
        "prediction": prediction.model_dump()
    }

@app.get("/api/alerts")
def get_alerts(limit: int = 40):
    return {"alerts": [a.model_dump() for a in alert_service.get_recent_alerts(limit)]}

@app.get("/api/dossier/{complaint_id:path}")
def get_actionable_intelligence_dossier(complaint_id: str):
    """Generates Section 91 CrPC / Section 94 BNSS Legal Actionable Intelligence Notice."""
    if complaint_id not in complaints_db:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    comp = complaints_db[complaint_id]
    pred = next((p for p in predictions_db.values() if p.complaint_id == complaint_id), None)
    
    dossier_id = f"I4C/INTEL/{datetime.now().strftime('%Y')}/{complaint_id.replace('/', '_')}"
    
    return {
        "dossier_id": dossier_id,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
        "issuing_authority": "Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs",
        "legal_statute": "Section 91 of Code of Criminal Procedure, 1973 r/w Section 94 of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023",
        "complaint": comp.model_dump(),
        "prediction": pred.model_dump() if pred else None,
        "designated_io": "Inspector Rajesh Chander, State Cyber Cell",
        "advisory_directive": (
            "1. Law Enforcement Officers within a 5 km perimeter of the targeted ATM are directed to establish covert surveillance.\n"
            "2. Respective Bank Branch Manager / ATM Custodian is instructed to verify suspicious cash withdrawals exceeding daily normal limits.\n"
            "3. Under CFCFRMS mandate, immediate lien of ₹" + f"{comp.fraud_amount:,.0f}" + " is requested on beneficiary account."
        )
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep alive and receive client events
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
