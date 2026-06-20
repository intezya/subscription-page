import type { SubscriptionCardData } from "./subscription-info";

export const MOCK_SUBSCRIPTION_INFO: SubscriptionCardData = {
  username: "github-pages-demo",
  status: "ACTIVE",
  daysLeft: 30,
  expiresAt: "2026-07-20T12:00:00.000Z",
  trafficUsed: "1.5 GiB",
  trafficLimit: "10 GiB",
  trafficUsedBytes: 1_610_612_736,
  trafficLimitBytes: 10_737_418_240,
  usagePercent: 15,
};
