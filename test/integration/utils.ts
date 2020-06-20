export function trimSlashes(url: string): string {
  return url.replace(/(^\/)|(^\\)|(\/$)|(\\$)/g, '');
}

export function removeTrailingSlash(url: string): string {
  return url.replace(/(\/$)|(\\$)/, '');
}
