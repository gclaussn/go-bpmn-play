package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"

	"github.com/gclaussn/go-bpmn/engine"
	"github.com/gclaussn/go-bpmn/engine/mem"
	"github.com/gclaussn/go-bpmn/http/server"
)

func New() (*Play, error) {
	e, err := mem.New()
	if err != nil {
		return nil, fmt.Errorf("failed to create mem engine: %v", err)
	}

	setTimeEnabled := true
	mux := server.NewMux(e, setTimeEnabled)

	return &Play{
		e:   e,
		mux: mux,
	}, nil
}

type Play struct {
	e   engine.Engine
	mux *http.ServeMux
}

func (p *Play) Execute(res Request) Response {
	w := httptest.NewRecorder()
	r := httptest.NewRequest(res.Method, res.Uri, strings.NewReader(res.Body))

	p.mux.ServeHTTP(w, r)

	return Response{
		Status: w.Code,
		Body:   w.Body.String(),
	}
}

func (p *Play) Shutdown() {
	p.e.Shutdown()
}

type Request struct {
	Method string `json:"method"`
	Uri    string `json:"uri"`
	Body   string `json:"body"`
}

type Response struct {
	Status int    `json:"status"`
	Body   string `json:"body"`
}
