# Graph Report - cybercrime-predictive-framework  (2026-09-07)

## Corpus Check
- 33 files · ~28,622 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 177 nodes · 318 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `86e44270`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CyberNetraWebSocket
- App.jsx
- package.json
- .predict_cashout
- 🛡️ CYBERSIGHT by Divyansh
- main.py
- ConnectionManager
- .oxlintrc.json
- React + Vite
- dependencies
- Prediction

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
- `dispatch_unit()` --uses--> `AlertNotification`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `freeze_account()` --uses--> `AlertNotification`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `PredictiveAnalyticsEngine` --uses--> `Prediction`  [INFERRED]
  backend/models/predictive_engine.py → backend/models/schemas.py
- `AlertDispatcherService` --uses--> `RiskLevel`  [INFERRED]
  backend/services/alert_dispatcher.py → backend/models/schemas.py

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 1 - "App.jsx"
Cohesion: 0.14
Nodes (10): DEMO_CREDENTIALS, LoginPage(), HelpGuideModal(), CRIME_PRESETS, BankNodalView(), FieldBeatOfficerView(), I4CCommandView(), api (+2 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (26): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+18 more)

### Community 3 - ".predict_cashout"
Cohesion: 0.29
Nodes (5): haversine_distance_km(), Any, Calculate the great circle distance between two points in km., Matches complaint to most likely syndicate hub based on crime category, bank,…, AI/ML predictive model to forecast: 1. Likely Cash-Out Hotspot & Specific…

### Community 4 - "🛡️ CYBERSIGHT by Divyansh"
Cohesion: 0.09
Nodes (21): 1. Clone the Repository, 2. Setup Database & Datasets, 3. Setup and Run Backend (FastAPI), 4. Setup and Run Frontend (React + Vite), 4. Setup and Run Frontend (React + Vite), 🗺️ 9 Detected Communities, 🏗️ Architecture & Data Flow, 🕸️ Codebase Knowledge Graph (+13 more)

### Community 5 - "main.py"
Cohesion: 0.13
Nodes (35): CustomIncidentInput, dispatch_unit(), freeze_account(), get_actionable_intelligence_dossier(), get_active_predictions(), get_alerts(), get_atms(), get_complaint_graph() (+27 more)

### Community 6 - "ConnectionManager"
Cohesion: 0.33
Nodes (3): ConnectionManager, websocket_endpoint(), WebSocket

### Community 7 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 8 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 9 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, leaflet, lucide-react, react, react-dom, react-leaflet, recharts, tailwindcss (+1 more)

### Community 13 - "Prediction"
Cohesion: 0.18
Nodes (8): AlertNotification, Prediction, AlertDispatcherService, Dispatches automated SMS, WhatsApp, and CFCFRMS Bank API alerts upon high-risk…, GraphForensicsService, Any, Adds victim, layered mule hops, and predicted cashout ATM to the directed graph., Returns JSON-serializable nodes and edges for a specific complaint.

## Knowledge Gaps
- **53 isolated node(s):** `👁️ CYBERSIGHT`, `National Predictive Cybercrime Cash-Out Forecasting & Proactive Intervention Platform`, `📌 Problem Statement Background`, `🏗️ Architecture & Data Flow`, `🏛️ God Nodes — Core Abstractions (Most Connected)` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `package.json`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `App.jsx` to `package.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Complaint` (e.g. with `inject_custom_incident()` and `PredictiveAnalyticsEngine`) actually correct?**
  _`Complaint` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Prediction` (e.g. with `PredictiveAnalyticsEngine` and `AlertDispatcherService`) actually correct?**
  _`Prediction` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `PredictiveAnalyticsEngine` (e.g. with `ATM` and `ATMType`) actually correct?**
  _`PredictiveAnalyticsEngine` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `RiskLevel` (e.g. with `freeze_account()` and `get_active_predictions()`) actually correct?**
  _`RiskLevel` has 6 INFERRED edges - model-reasoned connections that need verification._