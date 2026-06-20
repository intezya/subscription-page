export type SubscriptionStatus = "ACTIVE" | "DISABLED" | "LIMITED" | "EXPIRED";

export type RemnawaveSubscriptionInfoResponse = {
  response?: {
    user?: {
      username?: unknown;
      userStatus?: unknown;
      daysLeft?: unknown;
      expiresAt?: unknown;
      trafficUsed?: unknown;
      trafficLimit?: unknown;
      trafficUsedBytes?: unknown;
      trafficLimitBytes?: unknown;
    };
  };
};

export type SubscriptionCardData = {
  username: string;
  status: SubscriptionStatus;
  daysLeft: number;
  expiresAt: string;
  trafficUsed: string;
  trafficLimit: string;
  trafficUsedBytes: number;
  trafficLimitBytes: number | null;
  usagePercent: number | null;
};

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid Remnawave subscription response: ${field} is missing`);
  }
  return value;
}

function requireNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid Remnawave subscription response: ${field} is missing`);
  }
  return value;
}

function parseByteString(value: unknown, field: string): number {
  const raw = requireString(value, field);
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid Remnawave subscription response: ${field} is invalid`);
  }
  return parsed;
}

function parseStatus(value: unknown): SubscriptionStatus {
  if (value === "ACTIVE" || value === "DISABLED" || value === "LIMITED" || value === "EXPIRED") {
    return value;
  }
  throw new Error("Invalid Remnawave subscription response: user.userStatus is invalid");
}

export function normalizeSubscriptionInfo(
  payload: RemnawaveSubscriptionInfoResponse,
): SubscriptionCardData {
  const user = payload.response?.user;
  if (!user) {
    throw new Error("Invalid Remnawave subscription response: response.user is missing");
  }

  const trafficUsedBytes = parseByteString(user.trafficUsedBytes, "user.trafficUsedBytes");
  const rawTrafficLimitBytes = parseByteString(user.trafficLimitBytes, "user.trafficLimitBytes");
  const trafficLimitBytes = rawTrafficLimitBytes === 0 ? null : rawTrafficLimitBytes;
  const usagePercent =
    trafficLimitBytes == null
      ? null
      : Math.min(100, Math.max(0, (trafficUsedBytes / trafficLimitBytes) * 100));

  return {
    username: requireString(user.username, "user.username"),
    status: parseStatus(user.userStatus),
    daysLeft: requireNumber(user.daysLeft, "user.daysLeft"),
    expiresAt: requireString(user.expiresAt, "user.expiresAt"),
    trafficUsed: requireString(user.trafficUsed, "user.trafficUsed"),
    trafficLimit: requireString(user.trafficLimit, "user.trafficLimit"),
    trafficUsedBytes,
    trafficLimitBytes,
    usagePercent,
  };
}
