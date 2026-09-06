import sys, json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding="utf-8"))
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding="utf-8"))
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text(encoding="utf-8"))

G = build_from_json(extraction, root='.', directed=False)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

# Human-readable community labels
labels = {
    0: "FastAPI Routes & Endpoints",
    1: "React Frontend Components",
    2: "Frontend Config & Package",
    3: "AI Prediction Engine & Schemas",
    4: "Frontend Dependencies",
    5: "Data Generator & Seeder",
    6: "WebSocket Real-Time Layer",
    7: "Linting & Code Quality",
    8: "App Orchestration & API Client",
}

questions = suggest_questions(G, communities, labels)
report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding="utf-8")
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}, ensure_ascii=False), encoding="utf-8")

wrote = to_json(G, communities, 'graphify-out/graph.json', community_labels=labels)
if not wrote:
    print('WARNING: shrink guard prevented overwrite')
else:
    print('graph.json updated with community labels')

print('GRAPH_REPORT.md written')
print(f'Suggested questions:')
for q in questions[:5]:
    print(f'  - {q}')
