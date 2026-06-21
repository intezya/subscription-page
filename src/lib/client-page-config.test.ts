import assert from "node:assert/strict";

import {
  getClientNotFoundRedirectUrl,
  getClientSubscriptionUrl,
  getClientSubscriptionNotFoundRedirectUrl,
  getClientSupportUrl,
} from "./client-page-config.ts";

assert.equal(getClientSupportUrl(null, "https://t.me/build_support"), "https://t.me/build_support");
assert.equal(
  getClientSupportUrl(
    {
      supportUrl: "",
      subscriptionUrl: "",
      subscriptionNotFoundRedirectUrl: "",
      notFoundRedirectUrl: "",
    },
    "https://t.me/build_support",
  ),
  "https://t.me/build_support",
);
assert.equal(
  getClientSupportUrl(
    {
      supportUrl: "https://t.me/runtime_support",
      subscriptionUrl: "",
      subscriptionNotFoundRedirectUrl: "",
      notFoundRedirectUrl: "",
    },
    "https://t.me/build_support",
  ),
  "https://t.me/runtime_support",
);

assert.equal(
  getClientSubscriptionUrl(null, "https://build.example/subscription/user/buildShortUuid"),
  "https://build.example/subscription/user/buildShortUuid",
);
assert.equal(
  getClientSubscriptionUrl(
    {
      supportUrl: "",
      subscriptionUrl: "",
      subscriptionNotFoundRedirectUrl: "",
      notFoundRedirectUrl: "",
    },
    "https://build.example/subscription/user/buildShortUuid",
  ),
  "https://build.example/subscription/user/buildShortUuid",
);
assert.equal(
  getClientSubscriptionUrl(
    {
      supportUrl: "",
      subscriptionUrl: "https://runtime.example/subscription/user/runtimeShortUuid",
      subscriptionNotFoundRedirectUrl: "",
      notFoundRedirectUrl: "",
    },
    "https://build.example/subscription/user/buildShortUuid",
  ),
  "https://runtime.example/subscription/user/runtimeShortUuid",
);

assert.equal(
  getClientSubscriptionNotFoundRedirectUrl(null, "https://build.example/sub-not-found"),
  "https://build.example/sub-not-found",
);
assert.equal(
  getClientSubscriptionNotFoundRedirectUrl(
    {
      supportUrl: "",
      subscriptionUrl: "",
      subscriptionNotFoundRedirectUrl: "",
      notFoundRedirectUrl: "",
    },
    "https://build.example/sub-not-found",
  ),
  "https://build.example/sub-not-found",
);
assert.equal(
  getClientSubscriptionNotFoundRedirectUrl(
    {
      supportUrl: "",
      subscriptionUrl: "",
      subscriptionNotFoundRedirectUrl: "https://runtime.example/sub-not-found",
      notFoundRedirectUrl: "",
    },
    "https://build.example/sub-not-found",
  ),
  "https://runtime.example/sub-not-found",
);

assert.equal(
  getClientNotFoundRedirectUrl(null, "https://build.example/not-found"),
  "https://build.example/not-found",
);
assert.equal(
  getClientNotFoundRedirectUrl(
    {
      supportUrl: "",
      subscriptionUrl: "",
      subscriptionNotFoundRedirectUrl: "",
      notFoundRedirectUrl: "",
    },
    "https://build.example/not-found",
  ),
  "https://build.example/not-found",
);
assert.equal(
  getClientNotFoundRedirectUrl(
    {
      supportUrl: "",
      subscriptionUrl: "",
      subscriptionNotFoundRedirectUrl: "",
      notFoundRedirectUrl: "https://runtime.example/not-found",
    },
    "https://build.example/not-found",
  ),
  "https://runtime.example/not-found",
);
