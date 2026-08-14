import test from "node:test";
import assert from "node:assert/strict";
import { getPaymentStatusLabel, formatOrderTotal } from "./utils/helpers.js";

test("formatOrderTotal returns N/A for missing legacy amount", () => {
  assert.equal(formatOrderTotal({ currency: "usd" }), "N/A");
});

test("getPaymentStatusLabel maps refunded and failed states", () => {
  assert.equal(getPaymentStatusLabel({ refunded: true }), "Refunded");
  assert.equal(getPaymentStatusLabel({ payment_status: "failed" }), "Failed");
  assert.equal(getPaymentStatusLabel({ payment_status: "pending" }), "Pending");
});
