import assert from "node:assert/strict";

import { normalizeSubscriptionInfo } from "./subscription-info.ts";

const normalized = normalizeSubscriptionInfo({
  response: {
    user: {
      username: "intezya",
      userStatus: "ACTIVE",
      daysLeft: 14,
      expiresAt: "2026-07-04T12:00:00.000Z",
      trafficUsed: "1.5 GiB",
      trafficLimit: "10 GiB",
      trafficUsedBytes: "1610612736",
      trafficLimitBytes: "10737418240",
    },
  },
});

assert.equal(normalized.username, "intezya");
assert.equal(normalized.status, "ACTIVE");
assert.equal(normalized.daysLeft, 14);
assert.equal(normalized.trafficUsed, "1.5 GiB");
assert.equal(normalized.trafficLimit, "10 GiB");
assert.equal(normalized.trafficUsedBytes, 1_610_612_736);
assert.equal(normalized.trafficLimitBytes, 10_737_418_240);
assert.equal(normalized.usagePercent, 15);

const unlimited = normalizeSubscriptionInfo({
  response: {
    user: {
      username: "intezya",
      userStatus: "ACTIVE",
      daysLeft: 14,
      expiresAt: "2026-07-04T12:00:00.000Z",
      trafficUsed: "1.5 GiB",
      trafficLimit: "0",
      trafficUsedBytes: "1610612736",
      trafficLimitBytes: "0",
    },
  },
});

assert.equal(unlimited.trafficLimitBytes, null);
assert.equal(unlimited.usagePercent, null);

assert.throws(
  () => normalizeSubscriptionInfo({ response: { user: { username: "intezya" } } }),
  /user\.trafficUsedBytes/,
);
