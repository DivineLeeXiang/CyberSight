# Graph Report - cybercrime-predictive-framework  (2026-09-06)

## Corpus Check
- Corpus is ~27,974 words - fits in a single context window. You may not need a graph.

## Summary
- 151 nodes · 301 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- FastAPI Routes & Endpoints
- React Frontend Components
- Frontend Config & Package
- AI Prediction Engine & Schemas
- Frontend Dependencies
- Data Generator & Seeder
- WebSocket Real-Time Layer
- Linting & Code Quality
- App Orchestration & API Client

## God Nodes (most connected - your core abstractions)
1. `Complaint` - 13 edges
2. `react` - 13 edges
3. `PredictiveAnalyticsEngine` - 12 edges
4. `RiskLevel` - 12 edges
5. `Prediction` - 12 edges
6. `lucide-react` - 12 edges
7. `InterventionStatus` - 10 edges
8. `AlertNotification` - 9 edges
9. `CrimeCategory` - 8 edges
10. `AlertDispatcherService` - 8 edges

## Surprising Connections (you probably didn't know these)
- `init_and_seed()` --calls--> `generate_random_complaint()`  [INFERRED]
  database/seed_db.py → backend/services/data_generator.py
- `dispatch_unit()` --uses--> `AlertNotification`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `freeze_account()` --uses--> `AlertNotification`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `inject_custom_incident()` --uses--> `Complaint`  [INFERRED]
  backend/main.py → backend/models/schemas.py
- `inject_custom_incident()` --uses--> `LayerHop`  [INFERRED]
  backend/main.py → backend/models/schemas.py

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "FastAPI Routes & Endpoints"
Cohesion: 0.16
Nodes (27): CustomIncidentInput, dispatch_unit(), freeze_account(), get_actionable_intelligence_dossier(), get_active_predictions(), get_alerts(), get_atms(), get_complaint_graph() (+19 more)

### Community 1 - "React Frontend Components"
Cohesion: 0.16
Nodes (17): AlertsDrawer(), DEMO_CREDENTIALS, LoginPage(), PredictiveCashoutFeed(), MoneyLayeringGraph(), TacticalGISMap(), DossierModal(), HelpGuideModal() (+9 more)

### Community 2 - "Frontend Config & Package"
Cohesion: 0.08
Nodes (26): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+18 more)

### Community 3 - "AI Prediction Engine & Schemas"
Cohesion: 0.12
Nodes (15): haversine_distance_km(), Any, Calculate the great circle distance between two points in km., Matches complaint to most likely syndicate hub based on crime category, bank,…, AI/ML predictive model to forecast: 1. Likely Cash-Out Hotspot & Specific…, AlertNotification, Complaint, Prediction (+7 more)

### Community 4 - "Frontend Dependencies"
Cohesion: 0.22
Nodes (9): dependencies, leaflet, lucide-react, react, react-dom, react-leaflet, recharts, tailwindcss (+1 more)

### Community 5 - "Data Generator & Seeder"
Cohesion: 0.32
Nodes (6): Seeds initial 15 complaints with predictions, multi-layer graphs, and alerts., seed_initial_data(), LayerHop, generate_random_complaint(), Generates a realistic NCRP/1930 fraud complaint with multi-layer mule trail., init_and_seed()

### Community 6 - "WebSocket Real-Time Layer"
Cohesion: 0.33
Nodes (3): ConnectionManager, websocket_endpoint(), WebSocket

### Community 7 - "Linting & Code Quality"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **34 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 51 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `React Frontend Components` to `Frontend Config & Package`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `React Frontend Components` to `Frontend Config & Package`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Dependencies` to `Frontend Config & Package`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Complaint` (e.g. with `inject_custom_incident()` and `PredictiveAnalyticsEngine`) actually correct?**
  _`Complaint` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `PredictiveAnalyticsEngine` (e.g. with `ATM` and `ATMType`) actually correct?**
  _`PredictiveAnalyticsEngine` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `RiskLevel` (e.g. with `freeze_account()` and `get_active_predictions()`) actually correct?**
  _`RiskLevel` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Prediction` (e.g. with `PredictiveAnalyticsEngine` and `AlertDispatcherService`) actually correct?**
  _`Prediction` has 3 INFERRED edges - model-reasoned connections that need verification._