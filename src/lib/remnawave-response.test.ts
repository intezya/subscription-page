import assert from "node:assert/strict";

import { getSubscriptionInfoFailureStatus } from "./remnawave-response.ts";

assert.equal(getSubscriptionInfoFailureStatus(404), 404);
assert.equal(getSubscriptionInfoFailureStatus(410), 502);
assert.equal(getSubscriptionInfoFailureStatus(500), 502);
