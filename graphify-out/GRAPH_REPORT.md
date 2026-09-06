# Graph Report - cybercrime-predictive-framework  (2026-09-06)

## Corpus Check
- 33 files · ~28,502 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 172 nodes · 314 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8faf2f00`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.py
- App.jsx
- package.json
- PredictiveAnalyticsEngine
- 👁️ CYBERSIGHT
- get
- ConnectionManager
- .oxlintrc.json
- CyberNetraWebSocket
- devDependencies
- .get_complaint_subgraph

## God Nodes (most connected - your core abstractions)
1. `Complaint` - 13 edges
2. `react` - 13 edges
3. `PredictiveAnalyticsEngine` - 12 edges
4. `RiskLevel` - 12 edges
5. `Prediction` - 12 edges
6. `lucide-react` - 12 edges
7. `👁️ CYBERSIGHT` - 10 edges
8. `InterventionStatus` - 10 edges
9. `AlertNotification` - 9 edges
10. `CrimeCategory` - 8 edges

## Surprising Connections (you probably didn't know these)
- `init_and_seed()` --calls--> `generate_random_complaint()`  [INFERRED]
  database/seed_db.py → backend/services/data_generator.py
- `PredictiveAnalyticsEngine` --uses--> `ATM`  [INFERRED]
  backend/models/predictive_engine.py → backend/models/schemas.py
- `PredictiveAnalyticsEngine` --uses--> `ATMType`  [INFERRED]
  backend/models/predictive_engine.py → backend/models/schemas.py
- `PredictiveAnalyticsEngine` --uses--> `Complaint`  [INFERRED]
  backend/models/predictive_engine.py → backend/models/schemas.py
- `PredictiveAnalyticsEngine` --uses--> `InterventionStatus`  [INFERRED]
  backend/models/predictive_engine.py → backend/models/schemas.py

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "main.py"
Cohesion: 0.13
Nodes (31): CustomIncidentInput, dispatch_unit(), freeze_account(), get_system_status(), inject_custom_incident(), BaseModel, Allows manual injection of a high-priority cybercrime complaint to test…, Seeds initial 15 complaints with predictions, multi-layer graphs, and alerts. (+23 more)

### Community 1 - "App.jsx"
Cohesion: 0.14
Nodes (10): DEMO_CREDENTIALS, LoginPage(), HelpGuideModal(), CRIME_PRESETS, BankNodalView(), FieldBeatOfficerView(), I4CCommandView(), api (+2 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (29): dependencies, leaflet, lucide-react, react, react-dom, react-leaflet, recharts, tailwindcss (+21 more)

### Community 3 - "PredictiveAnalyticsEngine"
Cohesion: 0.24
Nodes (6): haversine_distance_km(), PredictiveAnalyticsEngine, Any, Calculate the great circle distance between two points in km., Matches complaint to most likely syndicate hub based on crime category, bank,…, AI/ML predictive model to forecast: 1. Likely Cash-Out Hotspot & Specific…

### Community 4 - "👁️ CYBERSIGHT"
Cohesion: 0.10
Nodes (20): 1. Clone the Repository, 2. Setup Database & Datasets, 3. Setup and Run Backend (FastAPI), 4. Setup and Run Frontend (React + Vite), 🗺️ 9 Detected Communities, 🏗️ Architecture & Data Flow, 🕸️ Codebase Knowledge Graph, 👁️ CYBERSIGHT (+12 more)

### Community 5 - "get"
Cohesion: 0.22
Nodes (9): get_actionable_intelligence_dossier(), get_active_predictions(), get_alerts(), get_atms(), get_complaint_graph(), get_complaints(), get_hotspots(), Generates Section 91 CrPC / Section 94 BNSS Legal Actionable Intelligence… (+1 more)

### Community 6 - "ConnectionManager"
Cohesion: 0.33
Nodes (3): ConnectionManager, websocket_endpoint(), WebSocket

### Community 7 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 9 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react

## Knowledge Gaps
- **50 isolated node(s):** `National Predictive Cybercrime Cash-Out Forecasting & Proactive Intervention Platform`, `📌 Problem Statement Background`, `🏗️ Architecture & Data Flow`, `🏛️ God Nodes — Core Abstractions (Most Connected)`, `🔗 Surprising Connections (Graphify Discovered)` (+45 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `App.jsx` to `package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Complaint` (e.g. with `inject_custom_incident()` and `PredictiveAnalyticsEngine`) actually correct?**
  _`Complaint` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `PredictiveAnalyticsEngine` (e.g. with `ATM` and `ATMType`) actually correct?**
  _`PredictiveAnalyticsEngine` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `RiskLevel` (e.g. with `freeze_account()` and `get_active_predictions()`) actually correct?**
  _`RiskLevel` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Prediction` (e.g. with `PredictiveAnalyticsEngine` and `AlertDispatcherService`) actually correct?**
  _`Prediction` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `National Predictive Cybercrime Cash-Out Forecasting & Proactive Intervention Platform`, `📌 Problem Statement Background`, `🏗️ Architecture & Data Flow` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._