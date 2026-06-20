import assert from "node:assert/strict";

import { getClientSupportUrl } from "./client-page-config.ts";

assert.equal(getClientSupportUrl(null, "https://t.me/build_support"), "https://t.me/build_support");
assert.equal(
  getClientSupportUrl({ supportUrl: "" }, "https://t.me/build_support"),
  "https://t.me/build_support",
);
assert.equal(
  getClientSupportUrl({ supportUrl: "https://t.me/runtime_support" }, "https://t.me/build_support"),
  "https://t.me/runtime_support",
);
