type Props = {
  query?: Record<string, any>;
  body?: Record<string, any>;
  method?: "POST" | "GET";
};

async function fetchAPI(url: string, prop: Props = {}) {
  const query = prop.query ?? {};
  const body = prop.body ?? {};
  const method = prop.method ?? "GET";

  const _url = new URL(url);
  Object.keys(query).forEach((key) =>
    _url.searchParams.append(key, query[key])
  );

  const res = await fetch(_url.toString(), {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(method === "POST" && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch API");
  }

  const json = await res.json();

  return json;
}

export async function getVideo(id: string): Promise<VideoInfo> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/lover/video?id=${id}`
  );
  return data;
}

export async function getIndex(page = 1): Promise<SearchResult> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/lover?page=${page}`
  );
  return data;
}

export interface VideoInfo {
  id: string;
  title: string;
  video: string;
  category: Category;
}

export type Category = "한국야동" | "성인야동" | "레즈야동" | "게이야동";

export interface SearchResult {
  videos: SearchResultVideo[];
  count: number;
}

export interface SearchResultVideo {
  id: string;
  title: string;
}
