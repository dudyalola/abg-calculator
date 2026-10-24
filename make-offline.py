#!/usr/bin/env python3
"""Build the offline single-file copy of the calculator from index.html.

The repo copy is a small PWA: it links a manifest file and registers a service
worker. The vault copy is one self-contained file opened straight off disk, so
neither of those can be a separate request. This script is the only thing that
should ever write the vault copy — edit index.html, then run:

    python3 make-offline.py

Icons are already inlined as data URIs in index.html, so the manifest and the
service-worker registration are the only two differences.
"""

import json
import pathlib
import re
import sys
from urllib.parse import quote

HERE = pathlib.Path(__file__).resolve().parent
DEFAULT_OUT = pathlib.Path.home() / "Documents/RESIDENCY DATABASES/IM RESIDENCY/ABG Calculator.html"


def build(src: str, manifest: dict) -> str:
    # start_url/scope must not be relative in a data: manifest
    m = dict(manifest, start_url=".", scope=".")
    uri = "data:application/manifest+json," + quote(json.dumps(m, separators=(",", ":")), safe="")

    out, n = re.subn(
        r'<link rel="manifest" href="[^"]*">',
        f'<link rel="manifest" href="{uri}">',
        src,
        count=1,
    )
    if n != 1:
        sys.exit("make-offline: could not find the manifest link in index.html")

    out, n = re.subn(
        r'<script>\s*if\("serviceWorker" in navigator\).*?</script>\s*',
        "",
        out,
        count=1,
        flags=re.S,
    )
    if n != 1:
        sys.exit("make-offline: could not find the service-worker block in index.html")

    return out


def main() -> None:
    out_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUT
    src = (HERE / "index.html").read_text(encoding="utf-8")
    manifest = json.loads((HERE / "manifest.webmanifest").read_text(encoding="utf-8"))
    out_path.write_text(build(src, manifest), encoding="utf-8")
    print(f"wrote {out_path} ({out_path.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
