/**
 * This module provides functions for fetching data from the Hitomi API.
 * @packageDocumentation
 */

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
export function getIndexes(page?: number, language?: HitomiLanguage) {
  return fetchAPI(".", {
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
export function getSearch(
  query: string,
  page?: number,
  language?: HitomiLanguage
) {
  return fetchAPI(".", {
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
export function getAutocomplete(query: string) {
  return fetchAPI("/suggest", {
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
export function getDetail(id: string) {
  return fetchAPI(`/detail/${id}`);
}

/**
 * Returns the URL for the specified image type and hash.
 * @param hash - The hash of the image.
 * @param type - The type of the image to retrieve.
 * @returns The URL of the specified image.
 */
export function getImageURL(
  hash: string,
  type:
    | "thumbnail"
    | "thumbnail-webp"
    | "thumbnail-avif"
    | "thumbnail-jpeg"
    | "webp"
    | "avif"
    | "jpeg"
) {
  switch (type) {
    case "thumbnail":
      return `${import.meta.env.PUBLIC_HITOMI_API_URL}/images/preview/${hash}`;
    case "thumbnail-webp":
      return `${
        import.meta.env.PUBLIC_HITOMI_API_URL
      }/images/preview/${hash}?type=webp`;
    case "thumbnail-avif":
      return `${
        import.meta.env.PUBLIC_HITOMI_API_URL
      }/images/preview/${hash}?type=avif`;
    case "thumbnail-jpeg":
      return `${
        import.meta.env.PUBLIC_HITOMI_API_URL
      }/images/preview/${hash}?type=jpeg`;
    case "webp":
      return `${import.meta.env.PUBLIC_HITOMI_API_URL}/images/webp/${hash}`;
    case "avif":
      return `${import.meta.env.PUBLIC_HITOMI_API_URL}/images/avif/${hash}`;
    case "jpeg":
      return `${import.meta.env.PUBLIC_HITOMI_API_URL}/images/jpeg/${hash}`;
  }
}

export interface IDetail {
  galleryurl: string;
  id: string;
  language_localname: string;
  video: any;
  characters: any;
  language: string;
  language_url: string;
  scene_indexes: any[];
  tags: Tag[];
  artists: Artist[];
  type: string;
  japanese_title: string | null;
  videofilename: any;
  languages: Language[];
  parodys: Parody[];
  title: string;
  groups: Group[];
  related: number[];
  files: File[];
  date: string;
}

export interface Character {
  url: string;
  character: string;
}

export interface Tag {
  female: string;
  url: string;
  male: string;
  tag: string;
}

export interface Artist {
  artist: string;
  url: string;
}

export interface Language {
  galleryid: string;
  language_localname: string;
  name: string;
  url: string;
}

export interface Parody {
  url: string;
  parody: string;
}

export interface Group {
  url: string;
  group: string;
}

export interface File {
  height: number;
  haswebp: number;
  width: number;
  name: string;
  hasavif: number;
  hash: string;
}
