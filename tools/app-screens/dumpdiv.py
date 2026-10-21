"""Writes the backend's Tarot screen to $OUT and its Explore hook to $OUT2. Run like dumpcat.py:
    OUT=$WORK/div_tarot.json OUT2=$WORK/div_hook.json python3 tools/app-screens/dumpdiv.py
"""
import asyncio, json, sys, os
BACKEND = os.environ.get('BACKEND_DIR') or os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'Plutto-Backend'))
sys.path.insert(0, BACKEND); os.chdir(BACKEND)
from app.services.features import divination as D
from app.services.features.explore_showcase import build_divination_hook
req = D._Req(language='en') if hasattr(D, '_Req') else None
out = asyncio.run(D.divination_screen('tarot', req, None))
json.dump(out, open(os.environ['OUT'], 'w'), ensure_ascii=False)
json.dump(build_divination_hook('tarot'), open(os.environ['OUT2'], 'w'), ensure_ascii=False)
print('ok', len(json.dumps(out)))
