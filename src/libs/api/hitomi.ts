/**
 * This module provides functions for fetching data from the Hitomi API.
 * @packageDocumentation
 */

/**
 * The properties for the fetchAPI function.
 */
type Props = {
  query?: Record<string, any>;
  body?: Record<string, any>;
  method?: "POST" | "GET";
};

/**
 * Fetches data from the Hitomi API.
 * @param path - The API endpoint path.
 * @param prop - The request properties.
 * @returns The JSON response from the API.
 * @throws An error if the API request fails.
 */
async function fetchAPI(path: string, prop: Props = {}) {
  const query = prop.query ?? {};
  const body = prop.body ?? {};
  const method = prop.method ?? "GET";

  const _url = new URL(import.meta.env.PUBLIC_HITOMI_API_URL + path);
  Object.keys(query).forEach(
    (key) => query[key] && _url.searchParams.append(key, query[key])
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
 * An array of all the supported languages in the Hitomi API.
 */
export const HitomiLanguages = [
  "indonesian",
  "javanese",
  "catalan",
  "cebuano",
  "czech",
  "danish",
  "german",
  "estonian",
  "english",
  "spanish",
  "esperanto",
  "french",
  "hindi",
  "icelandic",
  "italian",
  "latin",
  "hungarian",
  "dutch",
  "norwegian",
  "polish",
  "portuguese",
  "romanian",
  "albanian",
  "slovak",
  "serbian",
  "finnish",
  "swedish",
  "tagalog",
  "vietnamese",
  "turkish",
  "greek",
  "bulgarian",
  "mongolian",
  "russian",
  "ukrainian",
  "hebrew",
  "arabic",
  "persian",
  "thai",
  "korean",
  "chinese",
  "japanese",
] as const;

/**
 * A type that represents a language in the Hitomi API.
 */
export type HitomiLanguage = (typeof HitomiLanguages)[number] | "all";

/**
 * Fetches the indexes of items from the Hitomi API.
 * @param page - The page number to fetch.
 * @param language - The language to fetch indexes for. Defaults to "all".
 * @returns A Promise that resolves to the fetched indexes.
 */
function getIndexes(page?: number, language?: HitomiLanguage) {
  return fetchAPI("/", {
    query: {
      page,
      language,
    },
  });
}

/**
 * Searches for items in the Hitomi API.
 * @param query - The search query.
 * @param page - The page number to fetch.
 * @param language - The language to search in. Defaults to "all".
 * @returns A Promise that resolves to the search results.
 */
function search(query: string, page?: number, language?: HitomiLanguage) {
  return fetchAPI("/search", {
    query: {
      query,
      page,
      language,
    },
  });
}

/**
 * Autocompletes a search query in the Hitomi API.
 * @param query - The search query to autocomplete.
 * @returns A Promise that resolves to the autocomplete suggestions.
 */
function autocomplete(query: string) {
  return fetchAPI("/search/suggest", {
    query: {
      query,
    },
  });
}

/**
 * Fetches the details of a specific item from the Hitomi API.
 * @param id - The ID of the item to fetch.
 * @returns A Promise that resolves to the details of the item.
 */
function getDetail(id: string) {
  return fetchAPI(`/detail/${id}`);
}

/**
 * Returns the URL for the specified type of image with the given ID.
 * @param id - The ID of the image.
 * @param type - The type of image to get the URL for. Can be "thumbnail", "webp", "avif", or "jpeg".
 * @returns The URL for the specified type of image with the given ID.
 */
function getImageURL(id: string, type: "thumbnail" | "webp" | "avif" | "jpeg") {
  switch (type) {
    case "thumbnail":
      return `${import.meta.env.PUBLIC_HITOMI_API_URL}/images/preview/${id}`;
    case "webp":
      return `${import.meta.env.PUBLIC_HITOMI_API_URL}/images/webp/${id}`;
    case "avif":
      return `${import.meta.env.PUBLIC_HITOMI_API_URL}/images/avif/${id}`;
    case "jpeg":
      return `${import.meta.env.PUBLIC_HITOMI_API_URL}/images/jpeg/${id}`;
  }
}
