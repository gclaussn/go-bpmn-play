<p align="center">
  <a href="https://gclaussn.github.io/go-bpmn-play/">go-bpmn-play</a> is a static app that runs a <a href="https://github.com/gclaussn/go-bpmn">go-bpmn</a> in-memory process engine, compiled to WASM.
</p>

## Develop

Build WebAssembly and copy Go-specific JavaScript wrapper:

```sh
GOOS=js GOARCH=wasm go build -o ./public/play.wasm ./cmd/play

cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" ./public/
```

Start the development server:

```sh
npm run dev
```

## Generate

For the generation of the Vue [components](src/components/openapi/) from the OpenAPI documentation, the following steps need to be performed.

Specify the release tag, which should match the `github.com/gclaussn/go-bpmn` version that is set in [go.mod](go.mod):

```sh
export RELEASE_TAG_NAME="vX.Y.Z"
```

Run the following CURL command to download the `openapi.yaml` file:

```sh
curl -L \
-o openapi.yaml \
https://github.com/gclaussn/go-bpmn/releases/download/${RELEASE_TAG_NAME}/go-bpmn-openapi.yaml
```

Generate components:

```sh
go run cmd/generate-components/main.go \
-source-path openapi.yaml \
-output-path ./src/components/openapi
```

## Build

```sh
bash ./.github/workflows/build.sh
```

## Preview

To preview the built app, run:

```sh
npm run preview
```
