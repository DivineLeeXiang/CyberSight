# Graph Report - cybercrime-predictive-framework  (2026-09-06)

## Corpus Check
- 33 files · ~28,690 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 174 nodes · 316 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `73ae881b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.py
- App.jsx
- package.json
- .predict_cashout
- 🛡️ CYBERSIGHT by Divyansh
- get
- ConnectionManager
- .oxlintrc.json
- schemas.py
- dependencies
- .get_complaint_subgraph
- generate_random_complaint
- Complaint
- AlertNotification
- PredictiveAnalyticsEngine

## God Nodes (most connected - your core abstractions)
1. `Complaint` - 13 edges
2. `react` - 13 edges
3. `Prediction` - 12 edges
4. `RiskLevel` - 12 edges
5. `PredictiveAnalyticsEngine` - 12 edges
6. `lucide-react` - 12 edges
7. `🛡️ CYBERSIGHT by Divyansh` - 10 edges
8. `InterventionStatus` - 10 edges
9. `AlertNotification` - 9 edges
10. `💻 Quickstart & Local Installation` - 8 edges

## Surprising Connections (you probably didn't know these)
- `init_and_seed()` --calls--> `generate_random_complaint()`  [INFERRED]
  database/seed_db.py → backend/services/data_generator.py
- `CustomIncidentInput` --uses--> `CrimeCategory`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `dispatch_unit()` --uses--> `AlertNotification`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `freeze_account()` --uses--> `AlertNotification`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `PredictiveAnalyticsEngine` --uses--> `ATMType`  [INFERRED]
  backend/models/predictive_engine.py → backend/models/schemas.py

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "main.py"
Cohesion: 0.31
Nodes (9): CustomIncidentInput, dispatch_unit(), freeze_account(), inject_custom_incident(), BaseModel, Allows manual injection of a high-priority cybercrime complaint to test…, DispatchRequest, FreezeRequest (+1 more)

### Community 1 - "App.jsx"
Cohesion: 0.12
Nodes (12): App(), DEMO_CREDENTIALS, LoginPage(), HelpGuideModal(), CRIME_PRESETS, BankNodalView(), FieldBeatOfficerView(), I4CCommandView() (+4 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (26): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+18 more)

### Community 3 - ".predict_cashout"
Cohesion: 0.29
Nodes (5): haversine_distance_km(), Any, Calculate the great circle distance between two points in km., Matches complaint to most likely syndicate hub based on crime category, bank,…, AI/ML predictive model to forecast: 1. Likely Cash-Out Hotspot & Specific…

### Community 4 - "🛡️ CYBERSIGHT by Divyansh"
Cohesion: 0.09
Nodes (22): 1. Clone the Repository, 2. Setup Database & Datasets, 3. Setup and Run Backend (FastAPI), 4. Setup and Run Frontend (React + Vite), 4. Setup and Run Frontend (React + Vite), 🗺️ 9 Detected Communities, 🏗️ Architecture & Data Flow, 🕸️ Codebase Knowledge Graph (+14 more)

### Community 5 - "get"
Cohesion: 0.22
Nodes (9): get_actionable_intelligence_dossier(), get_active_predictions(), get_alerts(), get_atms(), get_complaint_graph(), get_complaints(), get_hotspots(), Generates Section 91 CrPC / Section 94 BNSS Legal Actionable Intelligence… (+1 more)

### Community 6 - "ConnectionManager"
Cohesion: 0.33
Nodes (3): ConnectionManager, websocket_endpoint(), WebSocket

### Community 7 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 8 - "schemas.py"
Cohesion: 0.56
Nodes (7): get_system_status(), ATMType, CrimeCategory, InterventionStatus, RiskLevel, Enum, str

### Community 9 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, leaflet, lucide-react, react, react-dom, react-leaflet, recharts, tailwindcss (+1 more)

### Community 11 - "generate_random_complaint"
Cohesion: 0.32
Nodes (6): Seeds initial 15 complaints with predictions, multi-layer graphs, and alerts., seed_initial_data(), LayerHop, generate_random_complaint(), Generates a realistic NCRP/1930 fraud complaint with multi-layer mule trail., init_and_seed()

### Community 12 - "Complaint"
Cohesion: 0.43
Nodes (5): Complaint, Prediction, BaseModel, GraphForensicsService, Adds victim, layered mule hops, and predicted cashout ATM to the directed graph.

### Community 13 - "AlertNotification"
Cohesion: 0.43
Nodes (3): AlertNotification, AlertDispatcherService, Dispatches automated SMS, WhatsApp, and CFCFRMS Bank API alerts upon high-risk…

## Knowledge Gaps
- **52 isolated node(s):** `👁️ CYBERSIGHT`, `National Predictive Cybercrime Cash-Out Forecasting & Proactive Intervention Platform`, `📌 Problem Statement Background`, `🏗️ Architecture & Data Flow`, `🏛️ God Nodes — Core Abstractions (Most Connected)` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `App.jsx` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Complaint` (e.g. with `inject_custom_incident()` and `PredictiveAnalyticsEngine`) actually correct?**
  _`Complaint` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Prediction` (e.g. with `PredictiveAnalyticsEngine` and `AlertDispatcherService`) actually correct?**
  _`Prediction` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `RiskLevel` (e.g. with `freeze_account()` and `get_active_predictions()`) actually correct?**
  _`RiskLevel` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `PredictiveAnalyticsEngine` (e.g. with `ATM` and `ATMType`) actually correct?**
  _`PredictiveAnalyticsEngine` has 6 INFERRED edges - model-reasoned connections that need verification._