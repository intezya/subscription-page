export function shouldRenderSubscriptionRootNotFound(
  shortUuid: string | undefined,
  useMockSubscriptionInfo: boolean,
): boolean {
  return !useMockSubscriptionInfo && !shortUuid;
}
