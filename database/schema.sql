-- ====================================================================
-- CYBER-NETRA | National Predictive Cybercrime Analytics Database Schema
-- Standard: Compatible with SQLite 3 and PostgreSQL 14+
-- Purpose: Ingestion of 8,000+ daily complaints, multi-layer mule forensics,
--          geospatial ATM vulnerability indexing, and proactive LEA dispatch.
-- ====================================================================

-- 1. HOTSPOT REGIONS (Known Cybercrime Clusters & Corridors)
CREATE TABLE IF NOT EXISTS hotspots (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    center_lat DECIMAL(9, 6) NOT NULL,
    center_lng DECIMAL(9, 6) NOT NULL,
    radius_km DECIMAL(6, 2) NOT NULL DEFAULT 20.0,
    mule_density_index DECIMAL(5, 2) NOT NULL,
    historical_cashout_count INT NOT NULL DEFAULT 0,
    primary_crimes TEXT, -- JSON Array of crime types
    police_jurisdiction VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ATM & MICRO-ATM GEODATABASE (Physical Cash Extraction Points)
CREATE TABLE IF NOT EXISTS atms (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bank VARCHAR(100) NOT NULL,
    atm_type VARCHAR(100) NOT NULL, -- 'Standalone Off-Site ATM', 'Branch On-Site ATM', 'Micro-ATM / Rural CSP Kiosk', etc.
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    vulnerability_score DECIMAL(5, 2) NOT NULL, -- 0-100 score based on past fraud, lighting, unattended status
    has_cctv_live BOOLEAN NOT NULL DEFAULT TRUE,
    daily_cash_limit BIGINT NOT NULL DEFAULT 500000,
    nearest_police_station VARCHAR(255) NOT NULL,
    sho_contact VARCHAR(50) NOT NULL,
    distance_to_station_km DECIMAL(6, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. MULE SYNDICATES & NEXUS HUBS
CREATE TABLE IF NOT EXISTS syndicates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    origin_hotspot_id VARCHAR(50) REFERENCES hotspots(id),
    primary_crime_category VARCHAR(150) NOT NULL,
    suspected_runner_count INT NOT NULL DEFAULT 10,
    common_layering_hops INT NOT NULL DEFAULT 2,
    preferred_cashout_method VARCHAR(100) NOT NULL,
    active_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    risk_severity VARCHAR(20) NOT NULL DEFAULT 'HIGH',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CITIZEN COMPLAINTS (NCRP 1930 Helpline Ingestion Stream)
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(100) PRIMARY KEY, -- Acknowledgment ID e.g. '2026/NCRP/894721'
    complaint_time TIMESTAMP NOT NULL,
    complainant_name VARCHAR(150) NOT NULL,
    complainant_city VARCHAR(100) NOT NULL,
    complainant_state VARCHAR(100) NOT NULL,
    complainant_phone VARCHAR(20) NOT NULL,
    crime_category VARCHAR(150) NOT NULL,
    fraud_amount DECIMAL(15, 2) NOT NULL,
    victim_bank VARCHAR(100) NOT NULL,
    victim_account VARCHAR(50) NOT NULL,
    current_mule_account VARCHAR(50) NOT NULL,
    current_mule_holder VARCHAR(150) NOT NULL,
    current_mule_bank VARCHAR(100) NOT NULL,
    current_mule_ifsc VARCHAR(20) NOT NULL,
    syndicate_id VARCHAR(50) REFERENCES syndicates(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. MULTI-LAYER TRANSACTION HOPS (Forensic Layering Trail)
CREATE TABLE IF NOT EXISTS layer_hops (
    id VARCHAR(100) PRIMARY KEY,
    complaint_id VARCHAR(100) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    layer_number INT NOT NULL, -- 1 = Victim to L1, 2 = L1 to L2, etc.
    from_account VARCHAR(50) NOT NULL,
    from_bank VARCHAR(100) NOT NULL,
    to_account VARCHAR(50) NOT NULL,
    to_bank VARCHAR(100) NOT NULL,
    ifsc VARCHAR(20) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    utr VARCHAR(50) NOT NULL,
    transfer_timestamp TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Settled'
);

-- 6. PREDICTIVE CASH-OUT FORECASTS (AI Spatio-Temporal Model Output)
CREATE TABLE IF NOT EXISTS predictions (
    id VARCHAR(100) PRIMARY KEY,
    complaint_id VARCHAR(100) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    predicted_at TIMESTAMP NOT NULL,
    expected_cashout_time TIMESTAMP NOT NULL,
    eta_minutes INT NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- 'CRITICAL', 'HIGH', 'ELEVATED', 'MONITORED'
    target_atm_id VARCHAR(50) NOT NULL REFERENCES atms(id),
    spatial_radius_km DECIMAL(6, 2) NOT NULL DEFAULT 5.0,
    target_pincode VARCHAR(10) NOT NULL,
    target_district VARCHAR(100) NOT NULL,
    target_state VARCHAR(100) NOT NULL,
    predicted_amount_to_withdraw DECIMAL(15, 2) NOT NULL,
    intervention_status VARCHAR(100) NOT NULL DEFAULT 'Pending Intervention',
    assigned_patrol_unit VARCHAR(150),
    cfcfrms_freeze_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. INTERVENTIONS & FIELD ACTIONS
CREATE TABLE IF NOT EXISTS interventions (
    id VARCHAR(100) PRIMARY KEY,
    prediction_id VARCHAR(100) NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    intervention_type VARCHAR(50) NOT NULL, -- 'PCR_DISPATCH', 'CFCFRMS_FREEZE', 'ATM_LOCK'
    executed_by VARCHAR(150) NOT NULL,
    agency VARCHAR(100) NOT NULL, -- 'State Cyber Police', 'Bank Nodal Branch', 'I4C HQ'
    status VARCHAR(50) NOT NULL DEFAULT 'EXECUTED',
    amount_secured DECIMAL(15, 2) NOT NULL,
    notes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. REAL-TIME ALERT NOTIFICATIONS LOG (SMS, WhatsApp, Webhooks)
CREATE TABLE IF NOT EXISTS alert_logs (
    id VARCHAR(100) PRIMARY KEY,
    prediction_id VARCHAR(100) REFERENCES predictions(id),
    channel VARCHAR(50) NOT NULL, -- 'SMS_BEAT_OFFICER', 'WHATSAPP_LEA', 'CFCFRMS_API_WEBHOOK'
    recipient VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'DELIVERED',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INDEXES FOR HIGH-THROUGHPUT PERFORMANCE (8,000 complaints/day)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_complaints_time ON complaints(complaint_time);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(crime_category);
CREATE INDEX IF NOT EXISTS idx_layer_hops_complaint ON layer_hops(complaint_id);
CREATE INDEX IF NOT EXISTS idx_layer_hops_to_acc ON layer_hops(to_account);
CREATE INDEX IF NOT EXISTS idx_predictions_complaint ON predictions(complaint_id);
CREATE INDEX IF NOT EXISTS idx_predictions_atm ON predictions(target_atm_id);
CREATE INDEX IF NOT EXISTS idx_predictions_risk ON predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_predictions_status ON predictions(intervention_status);
CREATE INDEX IF NOT EXISTS idx_atms_pincode ON atms(pincode);
CREATE INDEX IF NOT EXISTS idx_atms_district ON atms(district);
