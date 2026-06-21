export type RuntimePageConfig = {
  supportUrl: string;
  subscriptionUrl: string;
  subscriptionNotFoundRedirectUrl: string;
  notFoundRedirectUrl: string;
};

type RuntimeEnv = {
  SUPPORT_URL?: string;
  VITE_SUPPORT_URL?: string;
  SUBSCRIPTION_URL?: string;
  VITE_SUBSCRIPTION_URL?: string;
  SUBSCRIPTION_NOT_FOUND_REDIRECT_URL?: string;
  VITE_SUBSCRIPTION_NOT_FOUND_REDIRECT_URL?: string;
  NOT_FOUND_REDIRECT_URL?: string;
  VITE_NOT_FOUND_REDIRECT_URL?: string;
};

function runtimeEnvValue(
  env: RuntimeEnv,
  runtimeName: keyof RuntimeEnv,
  buildFallbackName: keyof RuntimeEnv,
): string {
  return env[runtimeName]?.trim() || env[buildFallbackName]?.trim() || "";
}

export function getRuntimeSupportUrl(env: RuntimeEnv): string {
  return runtimeEnvValue(env, "SUPPORT_URL", "VITE_SUPPORT_URL");
}

export function getRuntimeSubscriptionUrl(env: RuntimeEnv): string {
  return runtimeEnvValue(env, "SUBSCRIPTION_URL", "VITE_SUBSCRIPTION_URL");
}

export function getRuntimeSubscriptionNotFoundRedirectUrl(env: RuntimeEnv): string {
  return runtimeEnvValue(
    env,
    "SUBSCRIPTION_NOT_FOUND_REDIRECT_URL",
    "VITE_SUBSCRIPTION_NOT_FOUND_REDIRECT_URL",
  );
}

export function getRuntimeNotFoundRedirectUrl(env: RuntimeEnv): string {
  return runtimeEnvValue(env, "NOT_FOUND_REDIRECT_URL", "VITE_NOT_FOUND_REDIRECT_URL");
}

export function getRuntimePageConfig(env: RuntimeEnv): RuntimePageConfig {
  return {
    supportUrl: getRuntimeSupportUrl(env),
    subscriptionUrl: getRuntimeSubscriptionUrl(env),
    subscriptionNotFoundRedirectUrl: getRuntimeSubscriptionNotFoundRedirectUrl(env),
    notFoundRedirectUrl: getRuntimeNotFoundRedirectUrl(env),
  };
}
