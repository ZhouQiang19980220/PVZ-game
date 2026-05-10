#!/bin/bash
cd "$(dirname "$0")"
open http://localhost:8090
python3 -m http.server 8090
