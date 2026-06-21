import assert from "node:assert/strict";

import {
  getRuntimeNotFoundRedirectUrl,
  getRuntimePageConfig,
  getRuntimeSubscriptionUrl,
  getRuntimeSubscriptionNotFoundRedirectUrl,
  getRuntimeSupportUrl,
} from "./runtime-page-config.ts";

assert.equal(
  getRuntimeSupportUrl({
    SUPPORT_URL: "https://t.me/runtime_support",
    VITE_SUPPORT_URL: "https://t.me/build_support",
  }),
  "https://t.me/runtime_support",
);

assert.equal(
  getRuntimeSupportUrl({
    SUPPORT_URL: " ",
    VITE_SUPPORT_URL: "https://t.me/build_support",
  }),
  "https://t.me/build_support",
);

assert.equal(getRuntimeSupportUrl({ SUPPORT_URL: "", VITE_SUPPORT_URL: "" }), "");

assert.equal(
  getRuntimeSubscriptionUrl({
    SUBSCRIPTION_URL: "https://runtime.example/subscription/user/runtimeShortUuid",
    VITE_SUBSCRIPTION_URL: "https://build.example/subscription/user/buildShortUuid",
  }),
  "https://runtime.example/subscription/user/runtimeShortUuid",
);

assert.equal(
  getRuntimeSubscriptionUrl({
    SUBSCRIPTION_URL: " ",
    VITE_SUBSCRIPTION_URL: "https://build.example/subscription/user/buildShortUuid",
  }),
  "https://build.example/subscription/user/buildShortUuid",
);

assert.equal(
  getRuntimeSubscriptionNotFoundRedirectUrl({
    SUBSCRIPTION_NOT_FOUND_REDIRECT_URL: "https://runtime.example/sub-not-found",
    VITE_SUBSCRIPTION_NOT_FOUND_REDIRECT_URL: "https://build.example/sub-not-found",
  }),
  "https://runtime.example/sub-not-found",
);

assert.equal(
  getRuntimeSubscriptionNotFoundRedirectUrl({
    SUBSCRIPTION_NOT_FOUND_REDIRECT_URL: " ",
    VITE_SUBSCRIPTION_NOT_FOUND_REDIRECT_URL: "https://build.example/sub-not-found",
  }),
  "https://build.example/sub-not-found",
);

assert.equal(
  getRuntimeNotFoundRedirectUrl({
    NOT_FOUND_REDIRECT_URL: "https://runtime.example/not-found",
    VITE_NOT_FOUND_REDIRECT_URL: "https://build.example/not-found",
  }),
  "https://runtime.example/not-found",
);

assert.equal(
  getRuntimeNotFoundRedirectUrl({
    NOT_FOUND_REDIRECT_URL: " ",
    VITE_NOT_FOUND_REDIRECT_URL: "https://build.example/not-found",
  }),
  "https://build.example/not-found",
);

assert.deepEqual(
  getRuntimePageConfig({
    SUPPORT_URL: "https://t.me/runtime_support",
    SUBSCRIPTION_URL: "https://runtime.example/subscription/user/runtimeShortUuid",
    SUBSCRIPTION_NOT_FOUND_REDIRECT_URL: "https://runtime.example/sub-not-found",
    NOT_FOUND_REDIRECT_URL: "https://runtime.example/not-found",
  }),
  {
    supportUrl: "https://t.me/runtime_support",
    subscriptionUrl: "https://runtime.example/subscription/user/runtimeShortUuid",
    subscriptionNotFoundRedirectUrl: "https://runtime.example/sub-not-found",
    notFoundRedirectUrl: "https://runtime.example/not-found",
  },
);
