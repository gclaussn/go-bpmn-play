#!/usr/bin/env bash

set -e

# build WebAssembly
GOOS=js GOARCH=wasm go build -o ./public/play.wasm ./cmd/play

# opy Go-specific JavaScript wrapper
cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" ./public/

# build Github page
npm run build
