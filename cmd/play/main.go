package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"syscall/js"
)

var (
	play *Play
)

func main() {
	p, err := New()
	if err != nil {
		setError(err)
		os.Exit(1)
	}

	play = p

	js.Global().Set("playExecute", js.FuncOf(execute))
	js.Global().Set("playShutdown", js.FuncOf(shutdown))

	<-make(chan bool)
}

func execute(this js.Value, args []js.Value) any {
	if len(args) == 0 {
		setError(errors.New("failed to execute request: expected exactly one argument"))
		return nil
	}

	requestJson := args[0].String()

	var request Request
	if err := json.Unmarshal([]byte(requestJson), &request); err != nil {
		setError(fmt.Errorf("failed to unmarshal request: %v", err))
		return nil
	}

	response := play.Execute(request)

	responseJson, err := json.Marshal(response)
	if err != nil {
		setError(fmt.Errorf("failed to marshal response: %v", err))
		return nil
	}

	return string(responseJson)
}

func shutdown(this js.Value, args []js.Value) any {
	play.Shutdown()
	os.Exit(0)
	return nil
}

func setError(err error) {
	js.Global().Set("playError", err.Error())
}
