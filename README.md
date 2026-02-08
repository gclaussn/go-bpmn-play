<p align="center">
  <a href="https://gclaussn.github.io/go-bpmn-play/">go-bpmn-play</a> is a static app that runs a <a href="https://github.com/gclaussn/go-bpmn">go-bpmn</a> in-memory process engine, compiled to WASM.
</p>

## Develop

Build WebAssembly and copy Go-specific JavaScript wrapper:

```sh
GOOS=js GOARCH=wasm go build -o ./public/play.wasm ./cmd/play

cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" ./public/
```

