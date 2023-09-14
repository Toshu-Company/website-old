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
 * Fetches video data from the API based on the provided ID.
 * @param id - The ID of the video to fetch.
 * @returns A Promise that resolves to the fetched video data.
 */
export async function getVideo(id: string): Promise<VideoInfo> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/twi-videos/${id}`
  );
  return data;
}

/**
 * Fetches video detail data from the API based on the provided ID.
 * @param id - The ID of the video to fetch detail data for.
 * @returns A Promise that resolves to the fetched video detail data.
 */
export async function getDetail(
  id: string
): Promise<VideoDetail | Extended.VideoDetailExtend> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/twi-videos/${id}/detail`
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
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/twi-videos`,
    {
      query: { page },
    }
  );
  return data;
}

/**
 * Fetches the most recent 4 videos from the API.
 * @returns A Promise that resolves to the fetched recent videos data.
 */
export async function getRecent(): Promise<SearchResult> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/twi-videos/recent`
  );
  return data;
}

/**
 * Fetches a random video detail from the API.
 * @returns A Promise that resolves to the fetched random video detail data.
 */
export async function getRandom(): Promise<
  VideoDetail | Extended.VideoDetailExtend
> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/twi-videos/random`
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
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/twi-videos/search`,
    {
      query: { query, page },
    }
  );
  return data;
}

/**
 * Fetches a list of users based on a search query.
 * @param id - The search query string.
 * @param page - The page number to retrieve. Defaults to 1.
 * @returns A Promise that resolves to the search results data.
 */
export async function getSearchUser(
  id: string,
  page = 1
): Promise<SearchResult> {
  const data = await fetchAPI(
    `${import.meta.env.PUBLIC_TWITTER_API_URL}/twi-videos/search/user`,
    {
      query: { id, page },
    }
  );
  return data;
}

export interface SearchResult {
  videos: SearchResultVideo[];
  count: number;
}

export interface SearchResultVideo {
  id: string;
  thumbnail: string;
}

export interface VideoDetail {
  data: Data;
  includes: Includes;
  url: ArrayLikeObject<string>;
  video: ArrayLikeObject<string>;
  thumbnails: ArrayLikeObject<URL_TYPE>;
  uploader: string;
  uploader_id: string;
  uploader_url: string;
  webpage_url: string;
  title: string;
  formats: ArrayLikeObject<URL_TYPE>;
}

export namespace Extended {
  export function isExtendedVideoDetail(
    videoDetail: VideoDetail | VideoDetailExtend
  ): videoDetail is VideoDetailExtend {
    return "id" in videoDetail;
  }

  export interface VideoDetailExtend {
    created_at: string;
    id: number;
    id_str: string;
    full_text: string;
    truncated: boolean;
    display_text_range: number[];
    entities: Entities;
    extended_entities: ExtendedEntities;
    source: string;
    in_reply_to_status_id: any;
    in_reply_to_status_id_str: any;
    in_reply_to_user_id: any;
    in_reply_to_user_id_str: any;
    in_reply_to_screen_name: any;
    user: User;
    geo: any;
    coordinates: any;
    place: any;
    contributors: any;
    is_quote_status: boolean;
    retweet_count: number;
    favorite_count: number;
    favorited: boolean;
    retweeted: boolean;
    possibly_sensitive: boolean;
    possibly_sensitive_appealable: boolean;
    lang: string;
    text: string;
    url: string;
    uploader: string;
    uploader_id: string;
    uploader_url: string;
    webpage_url: string;
    title: string;
    formats: ArrayLikeObject<URL_TYPE>;
    thumbnails: ArrayLikeObject<URL_TYPE>;
  }

  export interface Entities {
    hashtags: Hashtag[];
    symbols: any[];
    user_mentions: any[];
    urls: any[];
    media: Media[];
  }

  export interface Hashtag {
    text: string;
    indices: number[];
  }

  export interface Media {
    id: number;
    id_str: string;
    indices: number[];
    media_url: string;
    media_url_https: string;
    url: string;
    display_url: string;
    expanded_url: string;
    type: string;
    sizes: Sizes;
  }

  export interface Sizes {
    thumb: Thumb;
    large: Large;
    medium: Medium;
    small: Small;
  }

  export interface Thumb {
    w: number;
    h: number;
    resize: string;
  }

  export interface Large {
    w: number;
    h: number;
    resize: string;
  }

  export interface Medium {
    w: number;
    h: number;
    resize: string;
  }

  export interface Small {
    w: number;
    h: number;
    resize: string;
  }

  export interface ExtendedEntities {
    media: ExtendedMedia[];
  }

  export interface ExtendedMedia extends Media {
    video_info: VideoInfo;
    additional_media_info: AdditionalMediaInfo;
  }

  export interface VideoInfo {
    aspect_ratio: number[];
    duration_millis: number;
    variants: Variant[];
  }

  export interface Variant {
    bitrate?: number;
    content_type: string;
    url: string;
  }

  export interface AdditionalMediaInfo {
    monetizable: boolean;
  }

  export interface User {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    description: string;
    url: any;
    entities: UserEntities;
    protected: boolean;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    created_at: string;
    favourites_count: number;
    utc_offset: any;
    time_zone: any;
    geo_enabled: boolean;
    verified: boolean;
    statuses_count: number;
    lang: any;
    contributors_enabled: boolean;
    is_translator: boolean;
    is_translation_enabled: boolean;
    profile_background_color: string;
    profile_background_image_url: any;
    profile_background_image_url_https: any;
    profile_background_tile: boolean;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    has_extended_profile: boolean;
    default_profile: boolean;
    default_profile_image: boolean;
    following: boolean;
    follow_request_sent: boolean;
    notifications: boolean;
    translator_type: string;
    withheld_in_countries: any[];
  }

  export interface UserEntities {
    description: Description;
  }

  export interface Description {
    urls: any[];
  }
}

export interface Data {
  text: string;
  author_id: string;
  id: string;
  edit_history_tweet_ids: string[];
  attachments: Attachments;
}

export interface Attachments {
  media_keys: string[];
}

export interface Includes {
  media: Media[];
  users: User[];
}

export interface Media {
  media_key: string;
  preview_image_url: string;
  type: string;
  variants: Variant[];
}

export interface Variant {
  bit_rate?: number;
  content_type: string;
  url: string;
}

export interface User {
  username: string;
  name: string;
  id: string;
}

export interface URL_TYPE {
  url: string;
}

export type ArrayLikeObject<T> = {
  [key in string]: T;
};

export interface VideoInfo {
  id: string;
  user: VideoInfoUser;
  tweet: string;
  title: string;
  thumbnail: string;
  video: string;
}

export interface VideoInfoUser {
  //   id: string;
  name: string;
  screen_name: string;
  profile_url: string;
}
