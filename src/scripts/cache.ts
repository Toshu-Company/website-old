export async function cachingThumbnail(url: string) {
  const cache = await caches.open("thumbnail");
  const response = await cache.match(url);
  if (response) {
    return response.blob();
  }
  return fetch(url).then((res) => {
    const response = res.clone();
    const headers = new Headers(response.headers);
    headers.set("Cached-Date", new Date().toUTCString());
    console.log(headers);
    cache.put(url, new Response(response.body, { headers }));
    return res.blob();
  });
}
