import assert from "node:assert/strict";

import { shouldRenderSubscriptionRootNotFound } from "./subscription-route.ts";

assert.equal(shouldRenderSubscriptionRootNotFound(undefined, false), true);
assert.equal(shouldRenderSubscriptionRootNotFound("", false), true);
assert.equal(shouldRenderSubscriptionRootNotFound("RUo2sPJ9Tz5tmTNm", false), false);
assert.equal(shouldRenderSubscriptionRootNotFound(undefined, true), false);
