export const NOT_FOUND_REDIRECT_URL = "https://google.com/";

export type RedirectLocation = Pick<Location, "replace">;

export function redirectNotFoundPath(location: RedirectLocation): void {
  location.replace(NOT_FOUND_REDIRECT_URL);
}
