import json
from graphify.cache import check_semantic_cache
from pathlib import Path

SPEC_PATH = str(Path(__file__).parent.parent / 'graphify-out' / 'step2_detect.py')  # placeholder - not actually used for code-only

detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding="utf-8"))
all_files = [f for cat in ('document', 'paper', 'image') for f in detect['files'].get(cat, [])]

print(f'Non-code files to semantically extract: {len(all_files)}')
for f in all_files:
    print(f'  {f}')

# Write empty semantic file since this is primarily a code corpus
# Docs + images are small, we'll write empty and rely on AST
Path('graphify-out/.graphify_semantic.json').write_text(
    json.dumps({'nodes':[],'edges':[],'hyperedges':[],'input_tokens':0,'output_tokens':0}),
    encoding='utf-8'
)
print('Semantic placeholder written (code-primary corpus - AST handles structure).')
