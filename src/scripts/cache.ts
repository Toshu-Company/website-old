export async function cachingThumbnail(url: string) {
  const cache = await caches.open("thumbnail");
  const response = await cache.match(url);
  if (response) {
    return response.blob();
  }
  return fetch(url).then((res) => {
    cache.put(url, res.clone());
    return res.blob();
  });
}
