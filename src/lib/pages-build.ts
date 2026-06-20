export function getGithubPagesBase(
  enabled: boolean,
  repository: string | undefined,
): string | undefined {
  if (!enabled) return undefined;
  const repoName = repository?.split("/").pop()?.trim();
  return repoName ? `/${repoName}/` : undefined;
}

export function getRouterBasepath(baseUrl: string): string {
  const trimmed = baseUrl.trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

export function isEnabledEnvValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}
