export function appendReferrer(__url: string, referrer: string) {
  const url = new URL(__url);

  url.searchParams.set("ref", referrer);

  return url.href;
}
