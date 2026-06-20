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
