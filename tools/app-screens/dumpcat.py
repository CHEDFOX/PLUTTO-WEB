import asyncio, json, sys, os
BACKEND = os.environ.get('BACKEND_DIR') or os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'Plutto-Backend'))
sys.path.insert(0, BACKEND)
os.chdir(BACKEND)
from app.services.features import catalog as C
C.__dict__.get('check_rate_limit')
import app.core.rate_limiter as rl
rl.check_rate_limit = lambda *a, **k: None
class R:
    headers = {}; client = type('c', (), {'host': '127.0.0.1'})(); query_params = {}
    url = type('u', (), {'path': '/api/public/catalog'})()
out = asyncio.run(C.get_catalog(R(), lang='en', app_version='9.0', platform='ios', system=sys.argv[1] if len(sys.argv) > 1 else None))
json.dump(out, open(os.environ['OUT'], 'w'), default=str, ensure_ascii=False, indent=1)
print('ok', len(json.dumps(out, default=str)))
