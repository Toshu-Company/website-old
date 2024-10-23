import { $setting } from "../../store/setting";

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
      "Cache-Control": $setting.get().nocache ? "no-cache" : "max-age=3600",
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

export async function getVideo(url: string): Promise<VideoDetailInfo> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/yatv/detail`,
    {
      method: "POST",
      body: { url },
    }
  );
  return data;
}

export async function getIndex(page = 1): Promise<SearchResult> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/yatv?page=${page}`
  );
  return data;
}

export const MIRROR_URL = `${
  import.meta.env.PUBLIC_TWITTER_API_URL
}/yatv/mirror`;
export async function mirror(url: string) {
  console.log("mirror", url);
  // const encoded = btoa(url);
  // const data = await fetch(`${MIRROR_URL}?url=${encoded}`);
  // return data;
  const data = await fetch(MIRROR_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
  return data;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  upload_date: string;
  playtime: string;
}

export interface VideoDetailInfo extends Video {
  video: string;
}

export interface SearchResultVideo extends Video {
  url: string;
}

export type SearchResult = SearchResultVideo[];
