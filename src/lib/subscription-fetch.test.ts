import assert from "node:assert/strict";

import { readSubscriptionInfoResponse } from "./subscription-fetch.ts";

await assert.rejects(
  () => readSubscriptionInfoResponse(Response.json({ error: "not found" }, { status: 404 })),
  (error) =>
    error instanceof Error &&
    "status" in error &&
    error.status === 404 &&
    error.message === "Failed to fetch subscription info",
);
