export function getShortUuidFromSubscriptionUrl(subscriptionUrl: string): string | undefined {
  const value = subscriptionUrl.trim();
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.pathname.split("/").filter(Boolean).at(-1);
  } catch {
    return value.split("/").filter(Boolean).at(-1);
  }
}

export function getShortUuidFromSubscriptionInfoRequest(
  requestUrl: string,
  fallbackSubscriptionUrl: string,
): string | undefined {
  const url = new URL(requestUrl, "http://localhost");
  const shortUuid = url.searchParams.get("shortUuid")?.trim();
  return shortUuid || getShortUuidFromSubscriptionUrl(fallbackSubscriptionUrl);
}

export function getSubscriptionInfoPath(shortUuid: string | undefined): string {
  if (!shortUuid) return "/api/subscription-info";
  const params = new URLSearchParams({ shortUuid });
  return `/api/subscription-info?${params.toString()}`;
}

export function getSubscriptionUrlForShortUuid(
  subscriptionUrl: string,
  shortUuid: string | undefined,
  origin?: string,
): string {
  if (!shortUuid) return subscriptionUrl;

  const trimmed = subscriptionUrl.trim();
  if (origin) {
    const url = new URL(origin);
    url.pathname = `/${encodeURIComponent(shortUuid)}`;
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  const url = new URL(trimmed || "/", "http://localhost");

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    segments.push(shortUuid);
  } else {
    segments[segments.length - 1] = shortUuid;
  }
  url.pathname = `/${segments.map(encodeURIComponent).join("/")}`;

  if (!origin && !/^[a-z][a-z\d+\-.]*:/i.test(trimmed)) {
    return `${url.pathname}${url.search}${url.hash}`;
  }
  return url.toString();
}
