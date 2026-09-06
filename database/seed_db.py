import sqlite3
import json
import csv
import os
import sys
import random
from datetime import datetime, timedelta

# Directories
DB_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(DB_DIR, "datasets")
ROOT_DIR = os.path.dirname(DB_DIR)
BACKEND_DATA_DIR = os.path.join(ROOT_DIR, "backend", "data")
SQL_SCHEMA_FILE = os.path.join(DB_DIR, "schema.sql")
SQLITE_DB_FILE = os.path.join(DB_DIR, "cyber_netra.db")

os.makedirs(DATASETS_DIR, exist_ok=True)

# Add backend to path to use existing data generators
sys.path.append(os.path.join(ROOT_DIR, "backend"))
from models.schemas import CrimeCategory, RiskLevel, InterventionStatus
from services.data_generator import generate_random_complaint

SYNDICATES_DATA = [
  {
    "id": "SYN-MEWAT-01",
    "name": "Al-Hind Fast-Withdrawal Task Ring",
    "origin_hotspot_id": "HOTSPOT-MEWAT-01",
    "primary_crime_category": "Task / Work from Home Scam",
    "suspected_runner_count": 28,
    "common_layering_hops": 2,
    "preferred_cashout_method": "Standalone Off-Site ATM",
    "active_status": "ACTIVE",
    "risk_severity": "CRITICAL"
  },
  {
    "id": "SYN-JAMTARA-02",
    "name": "Karmatar Biometric & Phish Nexus",
    "origin_hotspot_id": "HOTSPOT-JAMTARA-02",
    "primary_crime_category": "KYC Update / Bank Phishing",
    "suspected_runner_count": 45,
    "common_layering_hops": 3,
    "preferred_cashout_method": "Micro-ATM / Rural CSP Kiosk",
    "active_status": "ACTIVE",
    "risk_severity": "HIGH"
  },
  {
    "id": "SYN-SURAT-03",
    "name": "Varachha Current-Account Layering Shells",
    "origin_hotspot_id": "HOTSPOT-SURAT-04",
    "primary_crime_category": "Stock Trading / Investment Fraud",
    "suspected_runner_count": 32,
    "common_layering_hops": 3,
    "preferred_cashout_method": "Recycler / Cash Deposit Machine",
    "active_status": "ACTIVE",
    "risk_severity": "CRITICAL"
  },
  {
    "id": "SYN-BHARATPUR-04",
    "name": "Kaman Shadow Video Blackmail Fleet",
    "origin_hotspot_id": "HOTSPOT-BHARATPUR-03",
    "primary_crime_category": "Sextortion / Video Call Blackmail",
    "suspected_runner_count": 19,
    "common_layering_hops": 2,
    "preferred_cashout_method": "Standalone Off-Site ATM",
    "active_status": "ACTIVE",
    "risk_severity": "HIGH"
  },
  {
    "id": "SYN-GURUGRAM-05",
    "name": "Cyber-Hub Digital Arrest Impersonators",
    "origin_hotspot_id": "HOTSPOT-GURUGRAM-05",
    "primary_crime_category": "Digital Arrest / Fake Police CBI",
    "suspected_runner_count": 14,
    "common_layering_hops": 3,
    "preferred_cashout_method": "Highway / Transit Hub ATM",
    "active_status": "ACTIVE",
    "risk_severity": "CRITICAL"
  }
]

def init_and_seed():
    print(f"Initializing SQLite Database at: {SQLITE_DB_FILE}")
    if os.path.exists(SQLITE_DB_FILE):
        os.remove(SQLITE_DB_FILE)

    conn = sqlite3.connect(SQLITE_DB_FILE)
    cursor = conn.cursor()

    # 1. Execute Schema
    with open(SQL_SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)
    print("[OK] Relational schema successfully applied.")

    # 2. Seed Hotspots
    hotspots_json_path = os.path.join(BACKEND_DATA_DIR, "indian_hotspots.json")
    with open(hotspots_json_path, "r", encoding="utf-8") as f:
        hotspots = json.load(f)

    for h in hotspots:
        cursor.execute("""
            INSERT INTO hotspots (id, name, state, district, center_lat, center_lng, radius_km, mule_density_index, historical_cashout_count, primary_crimes, police_jurisdiction)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            h["id"], h["name"], h["state"], h["district"], h["center_lat"], h["center_lng"],
            h.get("radius_km", 20.0), h["mule_density_index"], h["historical_cashout_count"],
            json.dumps(h.get("primary_crimes", [])), h["police_jurisdiction"]
        ))
    print(f"[OK] Seeded {len(hotspots)} Hotspot corridors.")

    # 3. Seed ATMs
    atms_json_path = os.path.join(BACKEND_DATA_DIR, "atm_inventory.json")
    with open(atms_json_path, "r", encoding="utf-8") as f:
        atms = json.load(f)

    for a in atms:
        cursor.execute("""
            INSERT INTO atms (id, name, bank, atm_type, address, pincode, district, state, latitude, longitude, vulnerability_score, has_cctv_live, daily_cash_limit, nearest_police_station, sho_contact, distance_to_station_km)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            a["id"], a["name"], a["bank"], a["atm_type"], a["address"], a["pincode"],
            a["district"], a["state"], a["latitude"], a["longitude"], a["vulnerability_score"],
            1 if a.get("has_cctv_live", True) else 0, a.get("daily_cash_limit", 500000),
            a["nearest_police_station"], a["sho_contact"], a["distance_to_station_km"]
        ))
    print(f"[OK] Seeded {len(atms)} geolocated ATMs & Micro-ATMs.")

    # 4. Seed Syndicates
    for s in SYNDICATES_DATA:
        cursor.execute("""
            INSERT INTO syndicates (id, name, origin_hotspot_id, primary_crime_category, suspected_runner_count, common_layering_hops, preferred_cashout_method, active_status, risk_severity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            s["id"], s["name"], s["origin_hotspot_id"], s["primary_crime_category"],
            s["suspected_runner_count"], s["common_layering_hops"], s["preferred_cashout_method"],
            s["active_status"], s["risk_severity"]
        ))
    print(f"[OK] Seeded {len(SYNDICATES_DATA)} active mule syndicates.")

    # 5. Seed 100 Realistic Complaints, Layer Hops, and Predictions
    complaints_list = []
    layer_hops_list = []
    predictions_list = []

    now = datetime.now()
    for i in range(100):
        comp = generate_random_complaint()
        target_atm = random.choice(atms)
        syn = random.choice(SYNDICATES_DATA)
        
        # Insert Complaint
        cursor.execute("""
            INSERT INTO complaints (id, complaint_time, complainant_name, complainant_city, complainant_state, complainant_phone, crime_category, fraud_amount, victim_bank, victim_account, current_mule_account, current_mule_holder, current_mule_bank, current_mule_ifsc, syndicate_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            comp.id, comp.complaint_time, comp.complainant_name, comp.complainant_city, comp.complainant_state,
            comp.complainant_phone, comp.crime_category.value, comp.fraud_amount, comp.victim_bank,
            comp.victim_account, comp.current_mule_account, comp.current_mule_holder,
            comp.current_mule_bank, comp.current_mule_ifsc, syn["id"]
        ))

        # Insert Layer Hops
        for hop in comp.layer_hops:
            hop_id = f"HOP-{hop.utr[-8:]}"
            cursor.execute("""
                INSERT INTO layer_hops (id, complaint_id, layer_number, from_account, from_bank, to_account, to_bank, ifsc, amount, utr, transfer_timestamp, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                hop_id, comp.id, hop.layer, hop.from_account, hop.from_bank, hop.to_account,
                hop.to_bank, hop.ifsc, hop.amount, hop.utr, hop.timestamp, hop.status
            ))
            layer_hops_list.append({
                "id": hop_id,
                "complaint_id": comp.id,
                "layer_number": hop.layer,
                "from_account": hop.from_account,
                "from_bank": hop.from_bank,
                "to_account": hop.to_account,
                "to_bank": hop.to_bank,
                "amount": hop.amount,
                "utr": hop.utr
            })

        # Generate corresponding prediction
        eta = random.randint(15, 65)
        conf = round(random.uniform(74.0, 96.5), 1)
        risk = "CRITICAL" if eta <= 30 and conf >= 82 else ("HIGH" if eta <= 60 else "ELEVATED")
        status = random.choice(["Pending Intervention", "PCR / Beat Officer Dispatched", "Bank Account Frozen (CFCFRMS)", "Cash-Out Successfully Averted"])
        pred_id = f"PRED-{comp.id.replace('/', '-')}"
        exp_cashout = (now + timedelta(minutes=eta)).strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute("""
            INSERT INTO predictions (id, complaint_id, predicted_at, expected_cashout_time, eta_minutes, confidence_score, risk_level, target_atm_id, spatial_radius_km, target_pincode, target_district, target_state, predicted_amount_to_withdraw, intervention_status, assigned_patrol_unit, cfcfrms_freeze_ref)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            pred_id, comp.id, comp.complaint_time, exp_cashout, eta, conf, risk,
            target_atm["id"], 5.0, target_atm["pincode"], target_atm["district"], target_atm["state"],
            min(comp.fraud_amount, 200000), status,
            "PCR-UNIT-402" if "Dispatched" in status else None,
            f"CFCFRMS-{random.randint(100000, 999999)}" if "Frozen" in status else None
        ))

        complaints_list.append({
            "id": comp.id,
            "complaint_time": comp.complaint_time,
            "complainant_name": comp.complainant_name,
            "city": comp.complainant_city,
            "state": comp.complainant_state,
            "crime_category": comp.crime_category.value,
            "fraud_amount": comp.fraud_amount,
            "victim_bank": comp.victim_bank,
            "target_atm": target_atm["name"],
            "eta_minutes": eta,
            "risk_level": risk,
            "status": status
        })

    conn.commit()
    conn.close()
    print(f"[OK] Seeded 100 sample complaints, {len(layer_hops_list)} transaction hops, and 100 predictions.")

    # 6. Export Datasets to CSV & JSON
    print("\nExporting datasets to /database/datasets/...")

    # A. Hotspots CSV & JSON
    with open(os.path.join(DATASETS_DIR, "hotspots.json"), "w", encoding="utf-8") as f:
        json.dump(hotspots, f, indent=2)
    with open(os.path.join(DATASETS_DIR, "hotspots.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "name", "state", "district", "center_lat", "center_lng", "radius_km", "mule_density_index", "historical_cashout_count", "police_jurisdiction"])
        writer.writeheader()
        for h in hotspots:
            writer.writerow({k: h.get(k) for k in writer.fieldnames})

    # B. ATMs CSV & JSON
    with open(os.path.join(DATASETS_DIR, "atms_inventory.json"), "w", encoding="utf-8") as f:
        json.dump(atms, f, indent=2)
    with open(os.path.join(DATASETS_DIR, "atms_inventory.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "name", "bank", "atm_type", "address", "pincode", "district", "state", "latitude", "longitude", "vulnerability_score", "nearest_police_station", "sho_contact", "distance_to_station_km"])
        writer.writeheader()
        for a in atms:
            writer.writerow({k: a.get(k) for k in writer.fieldnames})

    # C. Syndicates JSON
    with open(os.path.join(DATASETS_DIR, "mule_syndicates.json"), "w", encoding="utf-8") as f:
        json.dump(SYNDICATES_DATA, f, indent=2)

    # D. Complaints CSV & JSON
    with open(os.path.join(DATASETS_DIR, "sample_complaints.json"), "w", encoding="utf-8") as f:
        json.dump(complaints_list, f, indent=2)
    with open(os.path.join(DATASETS_DIR, "sample_complaints.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "complaint_time", "complainant_name", "city", "state", "crime_category", "fraud_amount", "victim_bank", "target_atm", "eta_minutes", "risk_level", "status"])
        writer.writeheader()
        writer.writerows(complaints_list)

    # E. Layer Hops CSV
    with open(os.path.join(DATASETS_DIR, "layer_hops.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "complaint_id", "layer_number", "from_account", "from_bank", "to_account", "to_bank", "amount", "utr"])
        writer.writeheader()
        writer.writerows(layer_hops_list)

    print("[OK] All CSV and JSON datasets generated in /database/datasets/")
    print("\nDatabase setup complete!")

if __name__ == "__main__":
    init_and_seed()
