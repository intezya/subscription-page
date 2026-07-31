# Raw Subscription Route Design

## Goal

Add a deterministic public subscription URL:

```text
https://subs.vpn.intezya.ru/<shortUuid>/raw
```

A successful request to this URL must return the standard Base64-encoded list
of proxy URIs as `text/plain`, even when the requesting client normally asks
Remnawave for Xray JSON.

## Current Behavior

The custom server examines short subscription paths before TanStack Start
renders the React page. Browser user agents continue to the HTML page, while
non-browser user agents are proxied to Remnawave. The original user agent is
forwarded, so Remnawave currently returns Xray JSON to Happ and Base64 to an
unrecognized client.

Treating `raw` as an ordinary Remnawave client type does not work:
`/api/sub/<shortUuid>/raw` is unsupported and returns HTTP 403.

## Design

`raw` is a local format selector owned by this application, not a Remnawave
client type.

For `GET /<shortUuid>/raw`, the passthrough layer will:

1. Recognize `raw` before applying browser user-agent detection. Opening the
   raw URL in any client, including a browser, must return the raw
   subscription rather than HTML.
2. Request the base Remnawave endpoint `/api/sub/<shortUuid>` without appending
   `/raw`.
3. Replace the upstream `User-Agent` with
   `Remnawave Subscription Page Raw` and set `Accept: */*`. This user agent is
   intentionally outside Remnawave's JSON-capable client list, causing the
   configured fallback rule to select `XRAY_BASE64`.
4. Preserve the upstream response status, body, `Content-Type`, and allowed
   subscription metadata headers using the existing passthrough filtering.
5. Keep `cache: no-store`, bearer authentication, real-client IP forwarding,
   and the existing optional protected-panel headers unchanged.

All existing paths remain unchanged:

- `/<shortUuid>` keeps browser HTML and client-specific automatic format
  selection.
- `/<shortUuid>/clash`, `/mihomo`, `/json`, and other supported Remnawave
  client-type paths continue to pass the client type upstream.
- `/api/subscription-info` remains the JSON endpoint used only for the
  browser card.

## Error Behavior

Only a successful subscription response is required to be Base64
`text/plain`. Existing configuration and upstream failures retain their
current status and error response behavior. The raw handler does not decode,
rewrite, or synthesize subscription content.

## Security

- `REMNAWAVE_API_TOKEN` remains server-side and is never returned.
- The subscription short UUID keeps its existing bearer-secret semantics.
- Raw responses are not cached.
- Sensitive subscription bodies, UUIDs, metadata values, and credentials must
  not be printed during automated or live verification.

## Testing

Focused tests will prove:

1. `/<shortUuid>/raw` is recognized for both Happ and browser user agents.
2. The parsed raw request targets the base Remnawave subscription endpoint,
   not an unsupported `/raw` endpoint.
3. Raw upstream headers replace the original client user agent and prevent
   browser content negotiation.
4. Existing browser, ordinary Happ, and explicit supported-client behavior is
   unchanged.

Repository validation will include the focused passthrough test, route test,
TypeScript type checking, linting, production build, and dependency audit.

## Delivery and Live Verification

After the validated code is committed and pushed to `main`, the existing
GitHub Actions workflow will publish
`ghcr.io/shadowgatevpn/subscription-page:latest`. The live Dokploy service
`vpn-subscription-page-a7xoi1` on `de1` will pull and recreate only the
subscription-page container.

Live verification will use the configured subscription path without exposing
it and will confirm:

- `/<shortUuid>/raw` returns HTTP 200;
- `Content-Type` is `text/plain`;
- the body classifies as a Base64-encoded URI list without printing it;
- the ordinary browser URL still returns HTML;
- the ordinary Happ URL still retains its existing adaptive behavior;
- the recreated container uses the new image and has zero restarts.
