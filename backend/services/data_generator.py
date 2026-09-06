import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
from models.schemas import Complaint, LayerHop, CrimeCategory

INDIAN_BANKS = [
    ("State Bank of India", "SBIN000"),
    ("HDFC Bank", "HDFC000"),
    ("ICICI Bank", "ICIC000"),
    ("Punjab National Bank", "PUNB000"),
    ("Axis Bank", "UTIB000"),
    ("Bank of Baroda", "BARB000"),
    ("Airtel Payments Bank", "AIRP000"),
    ("Fino Payments Bank", "FINO000"),
    ("India Post Payments Bank", "IPOS000"),
    ("Kotak Mahindra Bank", "KKBK000")
]

FIRST_NAMES = [
    "Rajesh", "Pooja", "Vikram", "Sunita", "Amit", "Priya", "Rahul", "Ananya", 
    "Suresh", "Kavita", "Deepak", "Sneha", "Manoj", "Ritu", "Arjun", "Neelam",
    "Gaurav", "Swati", "Mohit", "Meenakshi", "Sanjay", "Preeti", "Harish", "Divya"
]

LAST_NAMES = [
    "Sharma", "Verma", "Mehta", "Patel", "Gupta", "Singh", "Reddy", "Iyer", 
    "Choudhary", "Joshi", "Bose", "Das", "Yadav", "Nair", "Mishra", "Kulkarni"
]

CITIES_BY_STATE = {
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Udaipur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
    "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur"]
}

CRIME_AMOUNTS = {
    CrimeCategory.DIGITAL_ARREST: (300000, 4500000),
    CrimeCategory.STOCK_TRADING_SCAM: (250000, 8000000),
    CrimeCategory.TASK_WORK_FROM_HOME: (40000, 650000),
    CrimeCategory.LOAN_APP_EXTORTION: (25000, 180000),
    CrimeCategory.KYC_PHISHING: (30000, 350000),
    CrimeCategory.SEXTORTION: (15000, 200000),
    CrimeCategory.CREDIT_CARD_OTP: (20000, 250000),
    CrimeCategory.AEPS_BIOMETRIC_CLONE: (10000, 120000)
}

def generate_random_complaint(complaint_id: str = None) -> Complaint:
    """Generates a realistic NCRP/1930 fraud complaint with multi-layer mule trail."""
    state = random.choice(list(CITIES_BY_STATE.keys()))
    city = random.choice(CITIES_BY_STATE[state])
    complainant = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    phone = f"+91 9{random.randint(100000000, 999999999)}"

    crime_cat = random.choice(list(CrimeCategory))
    min_amt, max_amt = CRIME_AMOUNTS[crime_cat]
    fraud_amount = round(random.uniform(min_amt, max_amt), -2)

    v_bank, v_ifsc = random.choice(INDIAN_BANKS[:6])
    v_acc = f"{random.randint(10000000000, 99999999999)}"

    # Generate 2 to 3 Layer Hops
    layer_hops = []
    hop_count = 3 if fraud_amount > 200000 else 2
    
    current_acc = v_acc
    current_bank = v_bank
    current_amt = fraud_amount
    now = datetime.now() - timedelta(minutes=random.randint(15, 90))

    for i in range(1, hop_count + 1):
        target_bank, target_ifsc_prefix = random.choice(INDIAN_BANKS)
        target_acc = f"{random.randint(10000000000, 99999999999)}"
        ifsc = f"{target_ifsc_prefix}{random.randint(1000, 9999)}"
        
        # Mules split or aggregate slightly
        hop_amt = round(current_amt * (0.95 if i > 1 else 1.0), -2)
        hop_time = now + timedelta(minutes=random.randint(5, 20) * i)
        utr = f"UTR{random.randint(100000000000, 999999999999)}"

        layer_hops.append(LayerHop(
            layer=i,
            from_account=current_acc,
            from_bank=current_bank,
            to_account=target_acc,
            to_bank=target_bank,
            ifsc=ifsc,
            amount=hop_amt,
            utr=utr,
            timestamp=hop_time.strftime("%Y-%m-%d %H:%M:%S"),
            status="Settled"
        ))
        current_acc = target_acc
        current_bank = target_bank
        current_amt = hop_amt

    cid = complaint_id or f"2026/NCRP/{random.randint(100000, 999999)}"
    last_hop = layer_hops[-1]
    mule_holder = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

    return Complaint(
        id=cid,
        complaint_time=(datetime.now() - timedelta(minutes=random.randint(10, 45))).strftime("%Y-%m-%d %H:%M:%S"),
        complainant_name=complainant,
        complainant_city=city,
        complainant_state=state,
        complainant_phone=phone,
        crime_category=crime_cat,
        fraud_amount=fraud_amount,
        victim_bank=v_bank,
        victim_account=v_acc,
        layer_hops=layer_hops,
        current_mule_account=last_hop.to_account,
        current_mule_holder=mule_holder,
        current_mule_bank=last_hop.to_bank,
        current_mule_ifsc=last_hop.ifsc
    )
