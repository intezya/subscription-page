import assert from "node:assert/strict";

import { getShortUuidFromSubscriptionUrl } from "./subscription-url.ts";

assert.equal(
  getShortUuidFromSubscriptionUrl("https://vpn.example.com/subscription/intezya/abc123def456"),
  "abc123def456",
);

assert.equal(
  getShortUuidFromSubscriptionUrl("https://vpn.example.com/subscription/intezya/abc123def456/"),
  "abc123def456",
);

assert.equal(getShortUuidFromSubscriptionUrl("/subscription/intezya/abc123def456"), "abc123def456");
assert.equal(getShortUuidFromSubscriptionUrl(""), undefined);
