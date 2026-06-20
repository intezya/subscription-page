import type { RuntimePageConfig } from "./runtime-page-config";

export function getClientSupportUrl(
  runtimeConfig: RuntimePageConfig | null,
  buildFallbackSupportUrl: string,
): string {
  return runtimeConfig?.supportUrl || buildFallbackSupportUrl;
}
