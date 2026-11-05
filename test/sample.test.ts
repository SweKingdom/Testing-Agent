import { test } from "node:test";
import assert from "node:assert/strict";
import { VERSION } from "../src/version.js";

test("VERSION is 0.1.0", () => {
  assert.equal(VERSION, "0.1.0");
});
