import assert from "node:assert/strict";

import {
  NOT_FOUND_REDIRECT_URL,
  redirectNotFoundPath,
  type RedirectLocation,
} from "./not-found-redirect.ts";

const redirects: string[] = [];
const location: RedirectLocation = {
  replace(url) {
    redirects.push(url);
  },
};

redirectNotFoundPath(location);

assert.deepEqual(redirects, [NOT_FOUND_REDIRECT_URL]);
assert.equal(NOT_FOUND_REDIRECT_URL, "https://google.com/");
