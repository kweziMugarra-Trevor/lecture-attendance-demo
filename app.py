# The original server source is stored in consecutive parts for this demo.
# They are combined and run as app.py, with no third-party loader required.
from pathlib import Path as _Path
_source_dir = _Path(__file__).resolve().parent / "server_source"
_source = "".join((_source_dir / f"part{i}.txt").read_text(encoding="utf-8") for i in range(1, 6))
exec(compile(_source, __file__, "exec"))
