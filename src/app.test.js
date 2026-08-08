import { describe, it } from "node:test"
import assert from "node:assert"

import { buildUri } from "./app.js"

describe("app", () => {
  it("buildUri", () => {
    it("with path parameters", () => {
      const definition = {
        requestUri: "/jobs/{partition}/{id}/complete",
        properties: [
          {
            name: "partition",
            inPath: true
          },
          {
            name: "id",
            inPath: true
          },
        ]
      }

      const data = {
        partition: "2026-01-01",
        id: 1,
        workerId: "play"
      }

      assert.equal(buildUri(definition, data), "/jobs/2026-01-01/1/complete")
      assert.equal(data.hasOwnProperty("partition"), false)
      assert.equal(data.hasOwnProperty("id"), false)
      assert.equal(data.hasOwnProperty("workerId"), true)
    })

    it("with path parameters, but no data", () => {
      const definition = {
        requestUri: "/jobs/{partition}/{id}/complete",
        properties: [
          {
            name: "partition",
            inPath: true
          },
          {
            name: "id",
            inPath: true
          },
        ]
      }

      assert.equal(buildUri(definition, {}), "/jobs/-/-/complete")
    })

    it("with query parameters", () => {
      const definition = {
        requestUri: "/processes/query",
        properties: [
          {
            name: "offset",
            inQuery: true
          },
          {
            name: "limit",
            inQuery: true
          }
        ]
      }

      const data = {
        offset: 20,
        limit: 10,
        tags: []
      }

      assert.equal(buildUri(definition, data), "/processes/query?offset=20&limit=10")
      assert.equal(data.hasOwnProperty("offset"), false)
      assert.equal(data.hasOwnProperty("limit"), false)
      assert.equal(data.hasOwnProperty("tags"), true)
    })

    it("with query parameters, but no data", () => {
      const definition = {
        requestUri: "/processes/query",
        properties: [
          {
            name: "offset",
            inQuery: true
          },
          {
            name: "limit",
            inQuery: true
          }
        ]
      }

      assert.equal(buildUri(definition, {}), "/processes/query")
    })
  })
})
