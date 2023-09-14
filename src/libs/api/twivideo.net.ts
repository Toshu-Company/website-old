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
 * Fetches video data from the API based on the provided page number.
 * @param page - The page number of the video data to fetch. Defaults to 1.
 * @returns A Promise that resolves to the fetched video data.
 */
export async function getIndex(
  offset = 0,
  limit = 45,
  type = 0
): Promise<SearchResult> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/twivideo`,
    {
      query: {
        offset,
        limit,
        type,
      },
    }
  );
  return data;
}

export interface SearchResult extends Array<VideoInfo> {}

export interface VideoInfo {
  video: string;
  thumbnail: string;
  twitter: string;
}
