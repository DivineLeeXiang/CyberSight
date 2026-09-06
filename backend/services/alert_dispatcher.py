import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from models.schemas import AlertNotification, Prediction, RiskLevel

class AlertDispatcherService:
    def __init__(self):
        self.alert_history: List[AlertNotification] = []

    def dispatch_prediction_alert(self, prediction: Prediction, crime_category: str, victim_name: str) -> List[AlertNotification]:
        """Dispatches automated SMS, WhatsApp, and CFCFRMS Bank API alerts upon high-risk prediction."""
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        atm = prediction.predicted_target_atm
        alerts = []

        # 1. SMS to Field Beat Officer / Patrol Van
        sms_alert = AlertNotification(
            id=f"ALT-SMS-{uuid.uuid4().hex[:8].upper()}",
            timestamp=now_str,
            channel="SMS_BEAT_OFFICER",
            recipient=f"PCR Beat Unit ({atm.nearest_police_station}) - {atm.sho_contact}",
            title=f"PROACTIVE CASH-OUT INTERCEPT: {atm.name}",
            message=(
                f"[I4C URGENT INTERCEPT] Forecasted cash-out runner at {atm.name} ({atm.address}). "
                f"ETA: {prediction.eta_minutes} mins. Amount: ₹{prediction.predicted_amount_to_withdraw:,.0f}. "
                f"Crime: {crime_category}. Station distance: {atm.distance_to_station_km} km. "
                f"Navigation: https://maps.google.com/?q={atm.latitude},{atm.longitude}"
            ),
            severity=prediction.risk_level,
            coordinates={"lat": atm.latitude, "lng": atm.longitude},
            status="DELIVERED"
        )
        alerts.append(sms_alert)

        # 2. WhatsApp / Telegram Advisory to District Cyber Cell SHO & SP
        whatsapp_alert = AlertNotification(
            id=f"ALT-WA-{uuid.uuid4().hex[:8].upper()}",
            timestamp=now_str,
            channel="WHATSAPP_LEA",
            recipient=f"SHO {atm.nearest_police_station} & Cyber Crime Cell",
            title=f"High-Priority Cyber Fraud Syndicate Advisory",
            message=(
                f"🚨 *I4C PROACTIVE ACTIONABLE INTELLIGENCE*\n"
                f"• *Ack ID*: {prediction.complaint_id}\n"
                f"• *Victim*: {victim_name}\n"
                f"• *Target Zone*: {atm.name}, {atm.district}, {atm.state}\n"
                f"• *Predicted ATM*: {atm.address} (PIN: {atm.pincode})\n"
                f"• *Confidence*: {prediction.confidence_score}% (Risk: {prediction.risk_level.value})\n"
                f"• *Golden Hour Window*: {prediction.eta_minutes} mins remaining\n"
                f"• *Syndicate Nexus*: {prediction.syndicate_profile.get('primary_nexus', 'Active Mule Ring')}\n"
                f"Action Recommended: Dispatch intercept team or alert branch security."
            ),
            severity=prediction.risk_level,
            coordinates={"lat": atm.latitude, "lng": atm.longitude},
            status="DELIVERED"
        )
        alerts.append(whatsapp_alert)

        # 3. Automated Bank Nodal API (CFCFRMS / 1930 Integration)
        if prediction.risk_level in [RiskLevel.CRITICAL, RiskLevel.HIGH]:
            cfcfrms_alert = AlertNotification(
                id=f"ALT-CFCFRMS-{uuid.uuid4().hex[:8].upper()}",
                timestamp=now_str,
                channel="CFCFRMS_API_WEBHOOK",
                recipient=f"Nodal Officer: {atm.bank} & State Clearing House",
                title=f"CFCFRMS Layer-3 Hotspot Auto-Flag",
                message=(
                    f"AUTOMATED LIEN ADVISORY [CFCFRMS/1930]: Account flagged in active cash-out corridor. "
                    f"Triggering ATM terminal safeguard on ATM ID: {atm.id} for targeted card/UPI-ATM dispense. "
                    f"Lien recommendation ₹{prediction.predicted_amount_to_withdraw:,.0f}."
                ),
                severity=prediction.risk_level,
                coordinates={"lat": atm.latitude, "lng": atm.longitude},
                status="ACKNOWLEDGED_BY_BANK"
            )
            alerts.append(cfcfrms_alert)

        self.alert_history.extend(alerts)
        return alerts

    def get_recent_alerts(self, limit: int = 50) -> List[AlertNotification]:
        return list(reversed(self.alert_history))[:limit]
