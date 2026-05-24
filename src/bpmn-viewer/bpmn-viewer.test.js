import { describe, it } from "node:test"
import assert from "node:assert"

import { collectJobs, collectMarkers, collectTasks } from "./bpmn-viewer.js"

describe("bpmn-viewer", () => {
  it("collectJobs", () => {
    it("undefined", () => {
      const results = collectJobs(undefined)
      assert.equal(Object.keys(results).length, 0)
    })

    it("null", () => {
      const results = collectJobs(null)
      assert.equal(Object.keys(results).length, 0)
    })

    it("empty", () => {
      const results = collectJobs([])
      assert.equal(Object.keys(results).length, 0)
    })

    it("should exclude CANCELED, CAUSED_RETRY, DONE", () => {
      const results = collectJobs([
        {bpmnElementId: "a", id: "1", partition: "2026-01-01", state: "CANCELED", type: ""},
        {bpmnElementId: "b", id: "2", partition: "2026-01-02", state: "CAUSED_RETRY", type: ""},
        {bpmnElementId: "c", id: "3", partition: "2026-01-03", state: "DONE", type: ""},
      ])

      assert.equal(Object.keys(results).length, 0)
    })

    it("should include CAUSED_INCIDENT, CREATED, DUE, LOCKED", () => {
      const results = collectJobs([
        {bpmnElementId: "a", id: "1", partition: "2026-01-01", state: "CAUSED_INCIDENT", type: "A"},
        {bpmnElementId: "b", id: "2", partition: "2026-01-02", state: "CREATED", type: "B"},
        {bpmnElementId: "c", id: "3", partition: "2026-01-03", state: "DUE", type: "C"},
        {bpmnElementId: "d", id: "4", partition: "2026-01-04", state: "LOCKED", type: "D"},
      ])

      assert.equal(Object.keys(results).length, 4)

      assert.ok(results["a"].job)
      assert.equal(results["a"].title, "Job 2026-01-01/1, Type: A, State: CAUSED_INCIDENT")

      assert.ok(results["b"].job)
      assert.equal(results["b"].title, "Job 2026-01-02/2, Type: B, State: CREATED")

      assert.ok(results["c"].job)
      assert.equal(results["c"].title, "Job 2026-01-03/3, Type: C, State: DUE")

      assert.ok(results["d"].job)
      assert.equal(results["d"].title, "Job 2026-01-04/4, Type: D, State: LOCKED")
    })

    it("should only factor in latest job per BPMN element ID", () => {
      const results = collectJobs([
        {bpmnElementId: "a", id: "1", partition: "2026-01-01", state: "CAUSED_INCIDENT", type: "A"},
        {bpmnElementId: "a", id: "2", partition: "2026-01-01", state: "COMPLETED", type: "A"},
      ])

      assert.equal(Object.keys(results).length, 0)
    })
  })

  it("collectMarkers", () => {
    it("undefined", () => {
      const results = collectMarkers(undefined)
      assert.equal(Object.keys(results).length, 0)
    })

    it("null", () => {
      const results = collectMarkers(null)
      assert.equal(Object.keys(results).length, 0)
    })

    it("empty", () => {
      const results = collectMarkers([])
      assert.equal(Object.keys(results).length, 0)
    })

    it("should exclude process", () => {
      const results = collectMarkers([
        {bpmnElementId: "a", bpmnElementType: "PROCESS", state: "STARTED"},
        {bpmnElementId: "b", bpmnElementType: "NONE_START_EVENT", state: "STARTED"},
      ])

      assert.equal(Object.keys(results).length, 1)
      assert.ok(results["b"])
    })

    it("should exclude CANCELED, COMPLETED, QUEUED and TERMINATED", () => {
      const results = collectMarkers([
        {bpmnElementId: "a", bpmnElementType: "A", state: "CANCELED"},
        {bpmnElementId: "b", bpmnElementType: "B", state: "COMPLETED"},
        {bpmnElementId: "c", bpmnElementType: "C", state: "QUEUED"},
        {bpmnElementId: "d", bpmnElementType: "D", state: "TERMINATED"},
      ])

      assert.equal(Object.keys(results).length, 0)
    })

    it("should exclude sub-process that is not in state CREATED", () => {
      const results = collectMarkers([
        {bpmnElementId: "a", bpmnElementType: "SUB_PROCESS", state: "CREATED"},
        {bpmnElementId: "b", bpmnElementType: "SUB_PROCESS", state: "STARTED"},
      ])

      assert.equal(Object.keys(results).length, 1)
      assert.ok(results["a"])
    })

    it("should use a special style for started call activities", () => {
      const results = collectMarkers([
        {bpmnElementId: "a", bpmnElementType: "CALL_ACTIVITY", state: "CREATED"},
        {bpmnElementId: "b", bpmnElementType: "CALL_ACTIVITY", state: "STARTED"},
      ])

      assert.equal(Object.keys(results).length, 2)
      assert.equal(results["a"], "viewer-marker-CREATED")
      assert.equal(results["b"], "viewer-marker-call-activity-STARTED")
    })

    it("should mark all completed when process instance completed, but exclude sub-processes", () => {
      const results = collectMarkers([
        {bpmnElementId: "a", bpmnElementType: "PROCESS", endedAt: "2026-05-15T16:22:49.44Z"},
        {bpmnElementId: "b", bpmnElementType: "B", state: "COMPLETED"},
        {bpmnElementId: "c", bpmnElementType: "SUB_PROCESS", state: "COMPLETED"},
        {bpmnElementId: "d", bpmnElementType: "D", state: "CANCELED"},
        {bpmnElementId: "e", bpmnElementType: "E", state: "TERMINATED"},
        {bpmnElementId: "f", bpmnElementType: "CALL_ACTIVITY", state: "COMPLETED"},
      ])

      assert.equal(Object.keys(results).length, 2)
      assert.equal(results["b"], "viewer-marker-COMPLETED")
      assert.equal(results["f"], "viewer-marker-call-activity-COMPLETED")
    })
  })

  it("collectTasks", () => {
    it("undefined", () => {
      const results = collectTasks(undefined)
      assert.equal(Object.keys(results).length, 0)
    })

    it("null", () => {
      const results = collectTasks(null)
      assert.equal(Object.keys(results).length, 0)
    })

    it("empty", () => {
      const results = collectTasks([])
      assert.equal(Object.keys(results).length, 0)
    })

    it("should exclude CANCELED, CAUSED_RETRY, DONE", () => {
      const results = collectTasks([
        {bpmnElementId: "a", id: "1", partition: "2026-01-01", state: "CANCELED", type: ""},
        {bpmnElementId: "b", id: "2", partition: "2026-01-02", state: "CAUSED_RETRY", type: ""},
        {bpmnElementId: "c", id: "3", partition: "2026-01-03", state: "DONE", type: ""},
      ])

      assert.equal(Object.keys(results).length, 0)
    })

    it("should include CAUSED_INCIDENT, CREATED, DUE, LOCKED", () => {
      const results = collectTasks([
        {bpmnElementId: "a", id: "1", partition: "2026-01-01", state: "CAUSED_INCIDENT", type: "A"},
        {bpmnElementId: "b", id: "2", partition: "2026-01-02", state: "CREATED", type: "B"},
        {bpmnElementId: "c", id: "3", partition: "2026-01-03", state: "DUE", type: "C"},
        {bpmnElementId: "d", id: "4", partition: "2026-01-04", state: "LOCKED", type: "D"},
      ])

      assert.equal(Object.keys(results).length, 4)

      assert.ok(results["a"].task)
      assert.equal(results["a"].title, "Task 2026-01-01/1, Type: A, State: CAUSED_INCIDENT")

      assert.ok(results["b"].task)
      assert.equal(results["b"].title, "Task 2026-01-02/2, Type: B, State: CREATED")

      assert.ok(results["c"].task)
      assert.equal(results["c"].title, "Task 2026-01-03/3, Type: C, State: DUE")

      assert.ok(results["d"].task)
      assert.equal(results["d"].title, "Task 2026-01-04/4, Type: D, State: LOCKED")
    })

    it("should only factor in latest task per BPMN element ID", () => {
      const results = collectTasks([
        {bpmnElementId: "a", id: "1", partition: "2026-01-01", state: "CAUSED_INCIDENT", type: "A"},
        {bpmnElementId: "a", id: "2", partition: "2026-01-01", state: "COMPLETED", type: "A"},
      ])

      assert.equal(Object.keys(results).length, 0)
    })
  })
})
