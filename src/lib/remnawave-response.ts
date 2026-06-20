export function getSubscriptionInfoFailureStatus(upstreamStatus: number): 404 | 502 {
  return upstreamStatus === 404 ? 404 : 502;
}
