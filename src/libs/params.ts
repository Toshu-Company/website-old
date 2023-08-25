export function updateParams(params: Record<string, string>) {
  if ("URLSearchParams" in window) {
    const searchParams = new URLSearchParams(window.location.search);
    for (const key in params) {
      searchParams.set(key, params[key]);
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${searchParams.toString()}`
    );
  } else {
    console.error("URLSearchParams not supported");
  }
}
