import { persistentAtom } from "@nanostores/persistent";
import { atom, type WritableAtom } from "nanostores";

export interface TwitterOptions {}

export interface TwitterVideo {
  id?: string;
  title?: string;
  user?: string;
  user_id?: string;
  user_url?: string;
  video: string;
  thumbnail: string;
  original: string;
  raw?: any;
}

export interface List<T> {
  videos: (T | Promise<T>)[];
  count: number;
}

export interface TwitterVideoList extends List<TwitterVideo> {}

export class FavoriteStore {
  private $rawFavorite: WritableAtom<string>;
  private $favorite: WritableAtom<string[]>;

  constructor(key: string) {
    this.$rawFavorite = persistentAtom<string>(`twitter:${key}:favorite`, "[]");
    this.$favorite = atom<string[]>(JSON.parse(this.$rawFavorite.get()));

    this.$favorite.listen((value) => {
      this.$rawFavorite.set(JSON.stringify(value));
    });
  }

  get favorite() {
    return this.$favorite;
  }
}

export abstract class VirtualTwitter {
  public abstract readonly favorite: FavoriteStore;

  // constructor(options: TwitterOptions) {}
  abstract getVideo(id: string): Promise<TwitterVideo>;

  abstract getVideoList(page: number): Promise<TwitterVideoList>;

  abstract getVideoIdList(page: number): Promise<List<string>>;

  abstract getVideoListByUser(
    user: string,
    page: number
  ): Promise<TwitterVideoList>;

  abstract getVideoIdListByUser(
    user: string,
    page: number
  ): Promise<List<string>>;

  abstract searchVideoList(
    keyword: string,
    page: number
  ): Promise<TwitterVideoList>;

  abstract searchVideoIdList(
    keyword: string,
    page: number
  ): Promise<List<string>>;

  abstract resolveVideo(url: string): Promise<string>;
}

export class Twitter extends VirtualTwitter {
  public readonly favorite = new FavoriteStore("default");

  // constructor(options: TwitterOptions) {
  //   super(options);
  // }

  async getVideo(id: string): Promise<TwitterVideo> {
    throw new Error("Method not implemented.");
  }

  async getVideoList(page: number): Promise<TwitterVideoList> {
    throw new Error("Method not implemented.");
  }

  async getVideoIdList(page: number): Promise<List<string>> {
    throw new Error("Method not implemented.");
  }

  async getVideoListByUser(
    user: string,
    page: number
  ): Promise<TwitterVideoList> {
    throw new Error("Method not implemented.");
  }

  getVideoIdListByUser(user: string, page: number): Promise<List<string>> {
    throw new Error("Method not implemented.");
  }

  async searchVideoList(
    keyword: string,
    page: number
  ): Promise<TwitterVideoList> {
    throw new Error("Method not implemented.");
  }
  searchVideoIdList(keyword: string, page: number): Promise<List<string>> {
    throw new Error("Method not implemented.");
  }
  async resolveVideo(url: string): Promise<string> {
    return url;
  }
}
