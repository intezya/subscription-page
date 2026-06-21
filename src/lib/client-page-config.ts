import type { RuntimePageConfig } from "./runtime-page-config";

type ClientRuntimePageConfig = RuntimePageConfig | null | undefined;

export function getClientSupportUrl(
  runtimeConfig: ClientRuntimePageConfig,
  buildFallbackSupportUrl: string,
): string {
  return runtimeConfig?.supportUrl || buildFallbackSupportUrl;
}

export function getClientSubscriptionUrl(
  runtimeConfig: ClientRuntimePageConfig,
  buildFallbackSubscriptionUrl: string,
): string {
  return runtimeConfig?.subscriptionUrl || buildFallbackSubscriptionUrl;
}

export function getClientSubscriptionNotFoundRedirectUrl(
  runtimeConfig: ClientRuntimePageConfig,
  buildFallbackRedirectUrl: string,
): string {
  return runtimeConfig?.subscriptionNotFoundRedirectUrl || buildFallbackRedirectUrl;
}

export function getClientNotFoundRedirectUrl(
  runtimeConfig: ClientRuntimePageConfig,
  buildFallbackRedirectUrl: string,
): string {
  return runtimeConfig?.notFoundRedirectUrl || buildFallbackRedirectUrl;
}
