import { $setting } from "../../store/setting";

/**
 * The properties for the fetchAPI function.
 */
type Props = {
  query?: Record<string, any>;
  body?: Record<string, any>;
  method?: "POST" | "GET";
};

/**
 * Fetches data from the API using the provided URL and properties.
 * @param url - The URL to fetch data from.
 * @param prop - The properties for the fetchAPI function.
 * @returns A Promise that resolves to the fetched data.
 */
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

/**
 * Fetches video data from the API based on the provided ID.
 * @param id - The ID of the video to fetch.
 * @returns A Promise that resolves to the fetched video data.
 */
export async function getVideo(id: string): Promise<VideoDetail> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/uraakalist/detail/${id}`
  );
  return data;
}

/**
 * Fetches video data from the API based on the provided page number.
 * @param page - The page number of the video data to fetch. Defaults to 1.
 * @returns A Promise that resolves to the fetched video data.
 */
export async function getIndex(page = 1): Promise<SearchResult> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/uraakalist`,
    {
      query: { page },
    }
  );
  return data;
}

/**
 * Fetches search results from the twi-videos API based on the provided query and page number.
 * @param query - The search query string.
 * @param page - The page number of the search results to fetch. Defaults to 1.
 * @returns A Promise that resolves to the search results data.
 */
export async function getSearch(
  query: string,
  page = 1
): Promise<SearchResult> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/uraakalist/search`,
    {
      query: { query, page },
    }
  );
  return data;
}

export interface SearchResult {
  tweets: SearchResultVideo[];
  users: any[];
  keywords: any[];
}

export interface SearchResultVideo {
  id: string;
  thumbnail: string;
  url: string;
  type: "video";
}

export interface VideoDetail {
  title: string;
  video: string;
  image?: string;
  user: string;
  username: string;
  user_recommend: SearchResultVideo[];
  recommend: SearchResultVideo[];
}
