from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class CrimeCategory(str, Enum):
    DIGITAL_ARREST = "Digital Arrest / Fake Police CBI"
    STOCK_TRADING_SCAM = "Stock Trading / Investment Fraud"
    TASK_WORK_FROM_HOME = "Task / Work from Home Scam"
    LOAN_APP_EXTORTION = "Loan App Harassment & Blackmail"
    KYC_PHISHING = "KYC Update / Bank Phishing"
    SEXTORTION = "Sextortion / Video Call Blackmail"
    CREDIT_CARD_OTP = "Credit Card / OTP Impersonation"
    AEPS_BIOMETRIC_CLONE = "AePS / Biometric Cloning Fraud"

class RiskLevel(str, Enum):
    CRITICAL = "CRITICAL"     # < 30 mins to cash-out, high confidence (>85%)
    HIGH = "HIGH"             # 30-90 mins, confidence 70-85%
    ELEVATED = "ELEVATED"     # 90-180 mins, confidence 50-70%
    MONITORED = "MONITORED"   # > 3 hours or under observation

class InterventionStatus(str, Enum):
    PENDING = "Pending Intervention"
    DISPATCHED = "PCR / Beat Officer Dispatched"
    ATM_MONITORED = "ATM Surveillance Activated"
    FROZEN_CFCFRMS = "Bank Account Frozen (CFCFRMS)"
    CASH_OUT_AVERTED = "Cash-Out Successfully Averted"
    WITHDRAWN = "Cash Withdrawn (Delayed Response)"

class ATMType(str, Enum):
    STANDALONE_OFFSITE = "Standalone Off-Site ATM"
    BRANCH_ONSITE = "Branch On-Site ATM"
    BANK_BRANCH_ONSITE = "Bank Branch On-Site ATM"
    MICRO_ATM_CSP = "Micro-ATM / Rural CSP Kiosk"
    HIGHWAY_TRANSIT = "Highway / Transit Hub ATM"
    CASH_DEPOSIT_MACHINE = "Recycler / Cash Deposit Machine"

class ATM(BaseModel):
    id: str
    name: str
    bank: str
    atm_type: ATMType
    address: str
    pincode: str
    district: str
    state: str
    latitude: float
    longitude: float
    vulnerability_score: float = Field(..., description="0-100 vulnerability score based on past fraud and lighting/CCTV")
    has_cctv_live: bool = True
    daily_cash_limit: int = 500000
    nearest_police_station: str
    sho_contact: str
    distance_to_station_km: float

class LayerHop(BaseModel):
    layer: int = Field(..., description="1 = Victim to Layer 1, 2 = Layer 1 to Layer 2, etc.")
    from_account: str
    from_bank: str
    to_account: str
    to_bank: str
    ifsc: str
    amount: float
    utr: str
    timestamp: str
    status: str  # "Settled", "Pending", "Lien Placed"

class Complaint(BaseModel):
    id: str = Field(..., description="NCRP Acknowledgment Number e.g. 2026/NCRP/894721")
    complaint_time: str
    complainant_name: str
    complainant_city: str
    complainant_state: str
    complainant_phone: str
    crime_category: CrimeCategory
    fraud_amount: float
    victim_bank: str
    victim_account: str
    layer_hops: List[LayerHop]
    current_mule_account: str
    current_mule_holder: str
    current_mule_bank: str
    current_mule_ifsc: str
    syndicate_id: Optional[str] = None
    syndicate_name: Optional[str] = None

class Prediction(BaseModel):
    id: str
    complaint_id: str
    predicted_at: str
    expected_cashout_time: str
    eta_minutes: int
    confidence_score: float = Field(..., description="Confidence percentage 0-100")
    risk_level: RiskLevel
    predicted_target_atm: ATM
    nearby_candidate_atms: List[ATM]
    spatial_radius_km: float
    target_pincode: str
    target_district: str
    target_state: str
    likely_cashout_method: ATMType
    predicted_amount_to_withdraw: float
    syndicate_profile: Optional[Dict[str, Any]] = None
    intervention_status: InterventionStatus = InterventionStatus.PENDING
    assigned_patrol_unit: Optional[str] = None
    cfcfrms_freeze_ref: Optional[str] = None
    action_log: List[Dict[str, Any]] = []

class DispatchRequest(BaseModel):
    prediction_id: str
    unit_id: str
    officer_name: str
    priority: str
    notes: Optional[str] = None

class FreezeRequest(BaseModel):
    complaint_id: str
    account_number: str
    ifsc: str
    bank_name: str
    freeze_amount: float
    action_type: str = "TOTAL_FREEZE"  # or LIEN_AMOUNT

class AlertNotification(BaseModel):
    id: str
    timestamp: str
    channel: str  # "SMS_BEAT_OFFICER", "WHATSAPP_LEA", "CFCFRMS_API_WEBHOOK", "SIREN_DASHBOARD"
    recipient: str
    title: str
    message: str
    severity: RiskLevel
    coordinates: Optional[Dict[str, float]] = None
    status: str = "DISPATCHED"
