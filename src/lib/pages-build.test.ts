import assert from "node:assert/strict";

import { getGithubPagesBase, getRouterBasepath, isEnabledEnvValue } from "./pages-build.ts";

assert.equal(getGithubPagesBase(false, "intezya/subscription-page"), undefined);
assert.equal(getGithubPagesBase(true, "intezya/subscription-page"), "/subscription-page/");
assert.equal(getGithubPagesBase(true, ""), undefined);

assert.equal(getRouterBasepath("/"), "/");
assert.equal(getRouterBasepath("/subscription-page/"), "/subscription-page");

assert.equal(isEnabledEnvValue("true"), true);
assert.equal(isEnabledEnvValue("1"), true);
assert.equal(isEnabledEnvValue("yes"), true);
assert.equal(isEnabledEnvValue(""), false);
assert.equal(isEnabledEnvValue("false"), false);
