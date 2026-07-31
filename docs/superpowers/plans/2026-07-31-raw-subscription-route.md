# Raw Subscription Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/<shortUuid>/raw` as a deterministic Base64 `text/plain` subscription URL and deliver it to the live `subs.vpn.intezya.ru` service.

**Architecture:** Keep the feature inside the existing pre-React subscription passthrough. Treat `raw` as a local selector: bypass browser rendering, omit `/raw` from the Remnawave URL, and replace upstream content-negotiation headers so Remnawave selects its `XRAY_BASE64` fallback. Preserve all existing response proxying and ordinary routes.

**Tech Stack:** TypeScript, Fetch API, TanStack Start server entry, Node assertion tests, Vite/Nitro, GitHub Actions, GHCR, Docker Compose/Dokploy.

## Global Constraints

- `/<shortUuid>/raw` must return Base64 `text/plain` for a successful live request.
- Ordinary browser, Happ, and supported explicit client-type routes must keep their current behavior.
- Do not expose subscription UUIDs, bodies, metadata values, API tokens, cookies, or runtime `.env` values.
- Do not add dependencies or create a separate TanStack route.
- Touch only the subscription passthrough, its focused test, README documentation, and this plan.
- Deploy only `vpn-subscription-page-a7xoi1-remnawave-subscription-page-1`; do not restart Dokploy or unrelated containers.

---

### Task 1: Implement the local raw selector through TDD

**Files:**
- Modify: `src/lib/subscription-passthrough.test.ts`
- Modify: `src/lib/subscription-passthrough.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: `getSubscriptionPassthroughRequest(request: Request)`, `handleSubscriptionPassthrough(request: Request)`, and the existing Remnawave server environment.
- Produces: `GET /<shortUuid>/raw`, which proxies `/api/sub/<shortUuid>` with `User-Agent: Remnawave Subscription Page Raw` and `Accept: */*`.

- [x] **Step 1: Write failing raw-route assertions**

Add `handleSubscriptionPassthrough` to the existing imports and append assertions that:

```ts
assert.deepEqual(
  getSubscriptionPassthroughRequest(
    new Request("https://subs.example.com/RUo2sPJ9Tz5tmTNm/raw", {
      headers: { "user-agent": "Mozilla/5.0 Safari/605.1.15" },
    }),
  ),
  { shortUuid: "RUo2sPJ9Tz5tmTNm", clientType: "raw" },
);
```

Then append the complete isolated passthrough assertion:

```ts
const originalFetch = globalThis.fetch;
const originalPanelUrl = process.env.REMNAWAVE_PANEL_URL;
const originalApiToken = process.env.REMNAWAVE_API_TOKEN;
let upstreamUrl = "";
let upstreamHeaders = new Headers();

try {
  process.env.REMNAWAVE_PANEL_URL = "https://panel.example.com";
  process.env.REMNAWAVE_API_TOKEN = "example-api-token";
  globalThis.fetch = (async (input, init) => {
    upstreamUrl = String(input);
    upstreamHeaders = new Headers(init?.headers);
    return new Response("dmxlc3M6Ly9leGFtcGxl", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }) as typeof fetch;

  const response = await handleSubscriptionPassthrough(
    new Request("https://subs.example.com/RUo2sPJ9Tz5tmTNm/raw", {
      headers: {
        accept: "application/json",
        "user-agent": "Happ/4.10.2/ios",
      },
    }),
  );

  assert.equal(upstreamUrl, "https://panel.example.com/api/sub/RUo2sPJ9Tz5tmTNm");
  assert.equal(upstreamHeaders.get("user-agent"), "Remnawave Subscription Page Raw");
  assert.equal(upstreamHeaders.get("accept"), "*/*");
  assert.equal(response?.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(await response?.text(), "dmxlc3M6Ly9leGFtcGxl");
} finally {
  globalThis.fetch = originalFetch;
  if (originalPanelUrl === undefined) delete process.env.REMNAWAVE_PANEL_URL;
  else process.env.REMNAWAVE_PANEL_URL = originalPanelUrl;
  if (originalApiToken === undefined) delete process.env.REMNAWAVE_API_TOKEN;
  else process.env.REMNAWAVE_API_TOKEN = originalApiToken;
}
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
rtk npx tsx src/lib/subscription-passthrough.test.ts
```

Expected: FAIL because a browser request to `/<shortUuid>/raw` currently returns
`null`, and the current Happ passthrough would target the unsupported upstream
`/api/sub/<shortUuid>/raw`.

- [x] **Step 3: Implement the minimal selector**

In `getSubscriptionPassthroughRequest`, decode the two route segments before
browser detection, identify exact decoded client type `raw`, and allow that
request through even for browser user agents:

```ts
let decodedShortUuid: string;
let decodedClientType: string | undefined;

try {
  decodedShortUuid = decodeURIComponent(shortUuid);
  decodedClientType = clientType ? decodeURIComponent(clientType) : undefined;
} catch {
  return null;
}

const forceRaw = decodedClientType === "raw";
if (!forceRaw && isBrowserUserAgent(request.headers.get("user-agent"))) return null;

return {
  shortUuid: decodedShortUuid,
  clientType: decodedClientType,
};
```

In `handleSubscriptionPassthrough`, calculate:

```ts
const forceRaw = subscriptionRequest.clientType === "raw";
```

For raw requests, pass `undefined` as the upstream client type and pass
`forceRaw` into `getRemnawavePassthroughHeaders`.

Extend `getRemnawavePassthroughHeaders` with a `forceRaw = false` parameter. For
raw requests, override copied headers:

```ts
if (forceRaw) {
  headers.set("Accept", "*/*");
  headers.set("user-agent", "Remnawave Subscription Page Raw");
} else {
  if (!headers.has("accept")) headers.set("Accept", "*/*");
  if (!headers.has("user-agent")) {
    headers.set("user-agent", "Remnawave Subscription Page");
  }
}
```

Keep authentication, IP forwarding, optional protected-panel headers,
`cache: "no-store"`, and response header filtering unchanged.

- [x] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
rtk npx tsx src/lib/subscription-passthrough.test.ts
rtk node src/routes/short-subscription-route.test.mjs
```

Expected: both commands exit 0 with no assertion output.

- [x] **Step 5: Document the raw URL**

Add a short `Raw Subscription URL` section to `README.md` stating:

```text
https://subs.example.com/<shortUuid>/raw
```

Explain that `raw` is handled locally, is not sent to Remnawave as a client
type, forces the Base64 fallback through a neutral upstream user agent, and
does not change the adaptive base subscription URL.

- [x] **Step 6: Run full repository validation**

Run:

```bash
rtk npx tsx src/lib/subscription-passthrough.test.ts
rtk node src/routes/short-subscription-route.test.mjs
rtk npm run lint
rtk npx tsc --noEmit
rtk npm run build
rtk npm audit --audit-level=high
rtk git diff --check
```

Expected: all commands exit 0. Existing warnings may be reported separately,
but no lint errors, type errors, build failures, high-severity audit failures,
or whitespace errors are allowed.

Execution note: focused tests, route test, ESLint, TypeScript, production build,
and `git diff --check` passed. The audit reproduced three pre-existing
transitive high findings before and after the feature change; production-only
audit reports two of them through existing Vite/TanStack build dependencies.
No dependency manifest or lockfile changed, so dependency remediation remains
outside this surgical feature release.

- [ ] **Step 7: Commit the implementation**

Run:

```bash
rtk git add src/lib/subscription-passthrough.ts src/lib/subscription-passthrough.test.ts README.md docs/superpowers/plans/2026-07-31-raw-subscription-route.md
rtk git diff --cached --check
rtk git commit -m "feat: add raw subscription route"
```

Expected: one implementation commit after the already committed design.

### Task 2: Publish and verify the live route

**Files:**
- No source files modified.
- Live owner: `/etc/dokploy/compose/vpn-subscription-page-a7xoi1/code/docker-compose.yml`

**Interfaces:**
- Consumes: the validated `main` branch and `.github/workflows/docker.yml`.
- Produces: `ghcr.io/shadowgatevpn/subscription-page:latest` running in `vpn-subscription-page-a7xoi1-remnawave-subscription-page-1`.

- [ ] **Step 1: Push the two local commits**

Run:

```bash
rtk git status --short --branch
rtk git push origin main
```

Expected: `origin/main` advances to the implementation commit and triggers
`Build and Push Docker Image`.

- [ ] **Step 2: Wait for the Docker workflow**

Run:

```bash
rtk gh run list --repo shadowgatevpn/subscription-page --workflow docker.yml --limit 3
rtk gh run watch "$(rtk gh run list --repo shadowgatevpn/subscription-page --workflow docker.yml --limit 1 --json databaseId --jq '.[0].databaseId')" --repo shadowgatevpn/subscription-page --exit-status
```

Expected: the new workflow run completes successfully and publishes `latest`.

- [ ] **Step 3: Validate and recreate only the subscription-page service**

Run:

```bash
rtk ssh de1 'cd /etc/dokploy/compose/vpn-subscription-page-a7xoi1/code && docker compose -p vpn-subscription-page-a7xoi1 -f docker-compose.yml config --quiet'
rtk ssh de1 'cd /etc/dokploy/compose/vpn-subscription-page-a7xoi1/code && docker compose -p vpn-subscription-page-a7xoi1 -f docker-compose.yml pull remnawave-subscription-page && docker compose -p vpn-subscription-page-a7xoi1 -f docker-compose.yml up -d --no-deps remnawave-subscription-page'
```

Expected: compose remains valid and only the custom service is recreated from
the newly published `latest` image.

- [ ] **Step 4: Verify the container**

Run:

```bash
rtk ssh de1 'docker inspect vpn-subscription-page-a7xoi1-remnawave-subscription-page-1 --format "image={{.Config.Image}} image_id={{.Image}} status={{.State.Status}} running={{.State.Running}} restart_count={{.RestartCount}} started={{.State.StartedAt}}"'
rtk ssh de1 'docker logs --tail 80 vpn-subscription-page-a7xoi1-remnawave-subscription-page-1'
```

Expected: image name is the Shadowgate GHCR package, status is running,
restart count is zero, and logs contain no startup failure.

- [ ] **Step 5: Verify public behavior without exposing subscription data**

Fetch `/api/page-config`, retain only the configured subscription pathname in
process memory, and probe the public hostname. Print only status, content type,
body classification, body size, and metadata-header presence.

Required assertions:

```text
browser base URL: 200 text/html
Happ base URL: 200 with existing adaptive JSON behavior
browser raw URL: 200 text/plain and Base64 URI-list classification
Happ raw URL: 200 text/plain and Base64 URI-list classification
```

Do not print the configured URL, short UUID, decoded URI list, response body,
or metadata values.

- [ ] **Step 6: Confirm repository and workflow state**

Run:

```bash
rtk git status --short --branch
rtk gh run list --repo shadowgatevpn/subscription-page --workflow docker.yml --limit 1
```

Expected: local `main` matches `origin/main`, the working tree is clean, and the
latest Docker workflow is successful.
