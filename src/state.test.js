import { describe, it } from "node:test"
import assert from "node:assert"

import { operations } from "./state.js"

describe("state", () => {
  it("operations", () => {
    it("isLatest", () => {
      operations.add({is2xx: true})
      operations.add({is2xx: true})
      assert.ok(operations.isLatest() == false)

      operations.add({})

      operations.setSelected(1)
      assert.ok(operations.isLatest())
      operations.setSelected(2)
      assert.ok(operations.isLatest())
    })
  })
})
