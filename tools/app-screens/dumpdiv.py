import asyncio, json, sys, os
sys.path.insert(0, '/home/user/Plutto-Backend'); os.chdir('/home/user/Plutto-Backend')
from app.services.features import divination as D
from app.services.features.explore_showcase import build_divination_hook
req = D._Req(language='en') if hasattr(D, '_Req') else None
out = asyncio.run(D.divination_screen('tarot', req, None))
json.dump(out, open(os.environ['OUT'], 'w'), ensure_ascii=False)
json.dump(build_divination_hook('tarot'), open(os.environ['OUT2'], 'w'), ensure_ascii=False)
print('ok', len(json.dumps(out)))
