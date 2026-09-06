# Graph Report - cybercrime-predictive-framework  (2026-09-06)

## Corpus Check
- 33 files · ~28,587 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 173 nodes · 315 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f0fde1a2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- inject_custom_incident
- App.jsx
- package.json
- PredictiveAnalyticsEngine
- 🛡️ CYBERSIGHT by Divyansh
- main.py
- ConnectionManager
- .oxlintrc.json
- schemas.py
- dependencies
- .get_complaint_subgraph
- generate_random_complaint
- Complaint
- AlertNotification

## God Nodes (most connected - your core abstractions)
1. `Complaint` - 13 edges
2. `react` - 13 edges
3. `Prediction` - 12 edges
4. `PredictiveAnalyticsEngine` - 12 edges
5. `RiskLevel` - 12 edges
6. `lucide-react` - 12 edges
7. `InterventionStatus` - 10 edges
8. `🛡️ CYBERSIGHT by Divyansh` - 9 edges
9. `AlertNotification` - 9 edges
10. `💻 Quickstart & Local Installation` - 8 edges

## Surprising Connections (you probably didn't know these)
- `init_and_seed()` --calls--> `generate_random_complaint()`  [INFERRED]
  database/seed_db.py → backend/services/data_generator.py
- `CustomIncidentInput` --uses--> `CrimeCategory`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `inject_custom_incident()` --uses--> `LayerHop`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `inject_custom_incident()` --uses--> `Complaint`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `PredictiveAnalyticsEngine` --uses--> `Complaint`  [INFERRED]
  backend/models/predictive_engine.py → backend/models/schemas.py

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "inject_custom_incident"
Cohesion: 0.50
Nodes (4): CustomIncidentInput, inject_custom_incident(), BaseModel, Allows manual injection of a high-priority cybercrime complaint to test…

### Community 1 - "App.jsx"
Cohesion: 0.12
Nodes (12): App(), DEMO_CREDENTIALS, LoginPage(), HelpGuideModal(), CRIME_PRESETS, BankNodalView(), FieldBeatOfficerView(), I4CCommandView() (+4 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (26): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+18 more)

### Community 3 - "PredictiveAnalyticsEngine"
Cohesion: 0.24
Nodes (6): haversine_distance_km(), PredictiveAnalyticsEngine, Any, Calculate the great circle distance between two points in km., Matches complaint to most likely syndicate hub based on crime category, bank,…, AI/ML predictive model to forecast: 1. Likely Cash-Out Hotspot & Specific…

### Community 4 - "🛡️ CYBERSIGHT by Divyansh"
Cohesion: 0.09
Nodes (21): 1. Clone the Repository, 2. Setup Database & Datasets, 3. Setup and Run Backend (FastAPI), 4. Setup and Run Frontend (React + Vite), 4. Setup and Run Frontend (React + Vite), 🗺️ 9 Detected Communities, 🏗️ Architecture & Data Flow, 🕸️ Codebase Knowledge Graph (+13 more)

### Community 5 - "main.py"
Cohesion: 0.31
Nodes (10): get_actionable_intelligence_dossier(), get_active_predictions(), get_alerts(), get_atms(), get_complaint_graph(), get_complaints(), get_hotspots(), get_system_status() (+2 more)

### Community 6 - "ConnectionManager"
Cohesion: 0.33
Nodes (3): ConnectionManager, websocket_endpoint(), WebSocket

### Community 7 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 8 - "schemas.py"
Cohesion: 0.56
Nodes (7): ATM, ATMType, CrimeCategory, InterventionStatus, RiskLevel, Enum, str

### Community 9 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, leaflet, lucide-react, react, react-dom, react-leaflet, recharts, tailwindcss (+1 more)

### Community 11 - "generate_random_complaint"
Cohesion: 0.32
Nodes (6): Seeds initial 15 complaints with predictions, multi-layer graphs, and alerts., seed_initial_data(), LayerHop, generate_random_complaint(), Generates a realistic NCRP/1930 fraud complaint with multi-layer mule trail., init_and_seed()

### Community 12 - "Complaint"
Cohesion: 0.48
Nodes (4): Complaint, Prediction, GraphForensicsService, Adds victim, layered mule hops, and predicted cashout ATM to the directed graph.

### Community 13 - "AlertNotification"
Cohesion: 0.23
Nodes (9): dispatch_unit(), freeze_account(), AlertNotification, DispatchRequest, FreezeRequest, BaseModel, AlertDispatcherService, Dispatches automated SMS, WhatsApp, and CFCFRMS Bank API alerts upon high-risk… (+1 more)

## Knowledge Gaps
- **51 isolated node(s):** `👁️ CYBERSIGHT`, `National Predictive Cybercrime Cash-Out Forecasting & Proactive Intervention Platform`, `📌 Problem Statement Background`, `🏗️ Architecture & Data Flow`, `🏛️ God Nodes — Core Abstractions (Most Connected)` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `App.jsx` to `package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Complaint` (e.g. with `inject_custom_incident()` and `PredictiveAnalyticsEngine`) actually correct?**
  _`Complaint` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Prediction` (e.g. with `PredictiveAnalyticsEngine` and `AlertDispatcherService`) actually correct?**
  _`Prediction` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `PredictiveAnalyticsEngine` (e.g. with `ATM` and `ATMType`) actually correct?**
  _`PredictiveAnalyticsEngine` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `RiskLevel` (e.g. with `freeze_account()` and `get_active_predictions()`) actually correct?**
  _`RiskLevel` has 6 INFERRED edges - model-reasoned connections that need verification._