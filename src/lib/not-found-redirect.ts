export type RedirectLocation = Pick<Location, "replace">;

export function getNotFoundRedirectUrl(redirectUrl: string): string | undefined {
  const value = redirectUrl.trim();
  return value || undefined;
}

export function redirectNotFoundPath(location: RedirectLocation, redirectUrl: string): boolean {
  const value = getNotFoundRedirectUrl(redirectUrl);
  if (!value) return false;
  location.replace(value);
  return true;
}
