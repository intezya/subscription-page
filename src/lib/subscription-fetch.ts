import type { SubscriptionCardData } from "./subscription-info";

export class SubscriptionInfoFetchError extends Error {
  readonly status: number;

  constructor(status: number) {
    super("Failed to fetch subscription info");
    this.status = status;
  }
}

export async function readSubscriptionInfoResponse(
  response: Response,
): Promise<SubscriptionCardData> {
  if (!response.ok) {
    throw new SubscriptionInfoFetchError(response.status);
  }
  return (await response.json()) as SubscriptionCardData;
}
