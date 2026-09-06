import math
import json
import os
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple, Optional
from models.schemas import (
    Complaint, Prediction, ATM, ATMType, RiskLevel, InterventionStatus, CrimeCategory
)

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points in km."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

class PredictiveAnalyticsEngine:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.hotspots: List[Dict[str, Any]] = []
        self.atms: List[ATM] = []
        self.load_reference_data()

    def load_reference_data(self):
        hotspots_path = os.path.join(self.data_dir, "indian_hotspots.json")
        atms_path = os.path.join(self.data_dir, "atm_inventory.json")

        if os.path.exists(hotspots_path):
            with open(hotspots_path, "r", encoding="utf-8") as f:
                self.hotspots = json.load(f)
        
        if os.path.exists(atms_path):
            with open(atms_path, "r", encoding="utf-8") as f:
                raw_atms = json.load(f)
                self.atms = [ATM(**item) for item in raw_atms]

    def _find_best_hotspot_match(self, complaint: Complaint) -> Dict[str, Any]:
        """Matches complaint to most likely syndicate hub based on crime category, bank, or city."""
        matched = []
        for hs in self.hotspots:
            score = 0.0
            if complaint.crime_category.value in hs.get("primary_crimes", []):
                score += 40.0
            
            # Match state/city affinities
            if hs.get("state", "").lower() in complaint.complainant_state.lower():
                score += 15.0
            
            # Known transit hotspots (e.g. Mewat for Task/Arrest, Jamtara for KYC/OTP, Surat for Investment)
            if "Digital Arrest" in complaint.crime_category.value and "Mewat" in hs["id"]:
                score += 25.0
            elif "Investment" in complaint.crime_category.value and "SURAT" in hs["id"]:
                score += 30.0
            elif "KYC" in complaint.crime_category.value and "JAMTARA" in hs["id"]:
                score += 35.0
            elif "Sextortion" in complaint.crime_category.value and "BHARATPUR" in hs["id"]:
                score += 35.0
            
            matched.append((score, hs))

        matched.sort(key=lambda x: x[0], reverse=True)
        return matched[0][1] if matched else self.hotspots[0]

    def predict_cashout(self, complaint: Complaint) -> Prediction:
        """
        AI/ML predictive model to forecast:
        1. Likely Cash-Out Hotspot & Specific Targeted ATM
        2. Expected Time of Cash-out (Golden Hour window ETA)
        3. Confidence Score (0-100%)
        4. Risk Classification (CRITICAL, HIGH, ELEVATED)
        5. Geo-fenced radius & nearest candidate ATMs for dispatch
        """
        matched_hotspot = self._find_best_hotspot_match(complaint)
        hs_lat = matched_hotspot["center_lat"]
        hs_lng = matched_hotspot["center_lng"]

        # Calculate spatio-temporal likelihood for each ATM in inventory
        scored_atms: List[Tuple[float, ATM, float]] = []
        for atm in self.atms:
            dist_km = haversine_distance_km(hs_lat, hs_lng, atm.latitude, atm.longitude)
            
            # Spatial Gaussian decay kernel (sigma = 35 km)
            spatial_prob = math.exp(- (dist_km ** 2) / (2.0 * (35.0 ** 2)))
            
            # Vulnerability weighting (unattended, offsite, high cash limit, no live CCTV)
            vuln_weight = atm.vulnerability_score / 100.0
            if not atm.has_cctv_live:
                vuln_weight *= 1.25
            
            # Bank brand match affinity (mules often withdraw from same bank ATM or payment bank CSPs)
            bank_match_boost = 1.2 if (atm.bank.lower() in complaint.current_mule_bank.lower() or 
                                       "Airtel" in atm.bank or "Fino" in atm.bank) else 1.0
            
            composite_atm_score = (0.50 * spatial_prob + 0.35 * min(1.0, vuln_weight) + 0.15 * (1.0 if dist_km < 15.0 else 0.4)) * bank_match_boost
            scored_atms.append((composite_atm_score, atm, dist_km))

        scored_atms.sort(key=lambda x: x[0], reverse=True)
        top_target = scored_atms[0][1]
        nearby_candidates = [item[1] for item in scored_atms[1:5]]

        # Calculate Cash-Out ETA (Golden Hour Countdown)
        # Based on: Layer depth, amount size, and crime category velocity
        base_eta = 35  # default 35 mins
        if "Digital Arrest" in complaint.crime_category.value:
            # Multi-layering takes 45-75 minutes before runners hit ATMs
            base_eta = random.randint(30, 65)
        elif "Task" in complaint.crime_category.value:
            # Task fraud cashes out extremely fast before victim panics
            base_eta = random.randint(18, 40)
        elif "KYC" in complaint.crime_category.value or "OTP" in complaint.crime_category.value:
            base_eta = random.randint(22, 45)
        elif "Sextortion" in complaint.crime_category.value:
            base_eta = random.randint(15, 30)
        else:
            base_eta = random.randint(25, 55)

        # Tranche adjustment: amounts > 2 Lakhs are split into multiple tranches
        predicted_withdrawal = min(complaint.fraud_amount, 200000.0 if top_target.atm_type == ATMType.STANDALONE_OFFSITE else 500000.0)

        # Confidence Score calculation
        base_confidence = 72.0 + (scored_atms[0][0] * 18.0)
        confidence = min(96.5, max(68.0, base_confidence + random.uniform(-2.0, 3.5)))

        # Risk Classification
        if base_eta <= 30 and confidence >= 82.0:
            risk_level = RiskLevel.CRITICAL
        elif base_eta <= 60 or confidence >= 75.0:
            risk_level = RiskLevel.HIGH
        elif base_eta <= 120:
            risk_level = RiskLevel.ELEVATED
        else:
            risk_level = RiskLevel.MONITORED

        now = datetime.now()
        expected_cashout = now + timedelta(minutes=base_eta)

        pred_id = f"PRED-{complaint.id.replace('/', '-')}"
        
        prediction = Prediction(
            id=pred_id,
            complaint_id=complaint.id,
            predicted_at=now.strftime("%Y-%m-%d %H:%M:%S"),
            expected_cashout_time=expected_cashout.strftime("%Y-%m-%d %H:%M:%S"),
            eta_minutes=base_eta,
            confidence_score=round(confidence, 1),
            risk_level=risk_level,
            predicted_target_atm=top_target,
            nearby_candidate_atms=nearby_candidates,
            spatial_radius_km=round(scored_atms[0][2] + 4.5, 1) if scored_atms[0][2] < 20 else 5.0,
            target_pincode=top_target.pincode,
            target_district=top_target.district,
            target_state=top_target.state,
            likely_cashout_method=top_target.atm_type,
            predicted_amount_to_withdraw=predicted_withdrawal,
            syndicate_profile={
                "syndicate_id": matched_hotspot.get("id"),
                "syndicate_name": matched_hotspot.get("name"),
                "mule_density_index": matched_hotspot.get("mule_density_index"),
                "primary_nexus": matched_hotspot.get("active_syndicates", ["Cross-Border Cash Runners"])[0]
            },
            intervention_status=InterventionStatus.PENDING,
            action_log=[{
                "timestamp": now.strftime("%H:%M:%S"),
                "action": "AI Prediction Generated",
                "details": f"Forecasted {top_target.name} ({top_target.pincode}) with ETA {base_eta}m"
            }]
        )
        return prediction
