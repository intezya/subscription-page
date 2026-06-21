import assert from "node:assert/strict";

import {
  getNotFoundRedirectUrl,
  redirectNotFoundPath,
  type RedirectLocation,
} from "./not-found-redirect.ts";

const redirects: string[] = [];
const location: RedirectLocation = {
  replace(url) {
    redirects.push(String(url));
  },
};

assert.equal(getNotFoundRedirectUrl(" https://google.com "), "https://google.com");
assert.equal(getNotFoundRedirectUrl(""), undefined);
assert.equal(getNotFoundRedirectUrl("   "), undefined);

assert.equal(redirectNotFoundPath(location, "https://google.com"), true);
assert.equal(redirectNotFoundPath(location, ""), false);
assert.deepEqual(redirects, ["https://google.com"]);
