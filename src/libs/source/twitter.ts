import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { atom, type WritableAtom } from "nanostores";
import { useSyncExternalStore } from "react";
import { readable } from "svelte/store";

export interface TwitterOptions {}

export interface TwitterVideo {
  id: string;
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
  videos: T[];
  count: number;
}

export type Subscribable<T> = {
  subscribe: (subscription: (value: Readonly<T>) => void) => () => void;
};

export interface TwitterVideoList extends List<TwitterVideo> {}

export abstract class VirtualFavoriteStore<T, K extends "string" | "object"> {
  public Type!: K;

  abstract use(type: "react"): T[];
  abstract use(type: "svelte"): Subscribable<T[]>;

  abstract includes(id: T): boolean;

  abstract add(id: T): void;

  abstract remove(id: T): void;

  abstract import(data: T[]): void | Promise<void>;
  abstract export(): T[] | Promise<T[]>;
}

export class PersistentStore extends VirtualFavoriteStore<string, "string"> {
  private $rawFavorite: WritableAtom<string>;
  private $favorite: WritableAtom<string[]>;

  constructor(
    key: string,
    parent: string | null = "twitter",
    private readonly compare: (a: string, b: string) => boolean = (a, b) =>
      a === b
  ) {
    super();
    this.$rawFavorite = persistentAtom<string>(
      [parent, key, "favorite"].filter(Boolean).join(":"),
      "[]"
    );
    this.$favorite = atom<string[]>(JSON.parse(this.$rawFavorite.get()));

    this.$favorite.listen((value) => {
      this.$rawFavorite.set(JSON.stringify(value));
    });
  }

  use(type: "react"): string[];
  use(type: "svelte"): Subscribable<string[]>;
  use(type: "react" | "svelte"): string[] | Subscribable<string[]> {
    if (type === "react") {
      return useStore(this.$favorite);
    }
    if (type === "svelte") {
      return this.$favorite;
    }
    return this.$favorite.get();
  }

  override includes(id: string) {
    return this.$favorite.get().some((value) => this.compare(value, id));
  }

  override add(id: string) {
    if (!this.includes(id)) {
      this.$favorite.set(this.$favorite.get().concat(id));
    }
  }

  override remove(id: string) {
    this.$favorite.set(
      this.$favorite.get().filter((value) => !this.compare(value, id))
    );
  }

  override import(data: string[]) {
    this.$favorite.set(data);
  }

  override export() {
    return this.$favorite.get();
  }
}

export class IndexedDBStore<
  T extends { id: string }
> extends VirtualFavoriteStore<T, "object"> {
  public Type: "object" = "object";
  private db: IDBDatabase | undefined;

  private _cache: T[] = [];
  private _uncommitted: {
    type: "add" | "remove";
    video: T;
    date?: Date;
  }[] = [];
  private _event: EventTarget = new EventTarget();

  private _timer: NodeJS.Timeout;

  private _change() {
    this._event.dispatchEvent(new Event("change"));
  }

  private _sync() {
    if (!this.db) return;
    const transaction = this.db.transaction(["favorite"], "readwrite");
    const objectStore = transaction.objectStore("favorite");
    this._uncommitted.forEach((value) => {
      if (value.type === "add") {
        objectStore.add({
          ...value.video,
          date: value.date ?? new Date(),
        });
      } else {
        objectStore.delete(value.video.id!);
      }
    });
    this._uncommitted = [];
    const request = objectStore.index("date").openCursor();
    const cache: T[] = [];
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        cache.push(cursor.value);
        cursor.continue();
      } else {
        if (cache.length === 0) {
          console.log("Empty cache. Something went wrong.");
          console.log(this._cache, cache);
          // @ts-ignore
          window.cache = this._cache;
        } else {
          this._cache = cache;
          this._change();
        }
      }
    };
  }

  constructor(private readonly key: string) {
    super();
    const request = indexedDB.open(`twitter:${key}`, 2);
    request.onupgradeneeded = () => {
      this.db = request.result;
      const objectStore = this.db.createObjectStore("favorite", {
        keyPath: "id",
      });
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("date", "date", { unique: false });
    };
    request.onsuccess = () => {
      this.db = request.result;
      this._sync();
    };

    this._timer = setInterval(() => {
      this._sync();
    }, 1000 * 5);
  }

  override use(type: "react"): T[];
  override use(type: "svelte"): Subscribable<T[]>;
  override use(type: "react" | "svelte"): T[] | Subscribable<T[]> {
    if (type === "react") {
      return useSyncExternalStore(
        (onStoreChange: () => void) => {
          this._event.addEventListener("change", onStoreChange);

          return () => {
            this._event.removeEventListener("change", onStoreChange);
          };
        },
        () => {
          return this._cache;
        }
      );
    }
    if (type === "svelte") {
      return readable(this._cache, (set) => {
        const setCache = () => set(this._cache);

        this._event.addEventListener("change", setCache);

        return () => {
          this._event.removeEventListener("change", setCache);
        };
      });
    }
    return this._cache;
  }

  override includes(video: T) {
    return this._cache.some((v) => v.id === video.id);
  }

  override add(video: T) {
    this._uncommitted.push({
      type: "add",
      video,
      date: new Date(),
    });
    this._cache = this._cache.concat(video);
    this._change();
  }

  override remove(video: T) {
    this._uncommitted.push({ type: "remove", video });
    this._cache = this._cache.filter((v) => v.id !== video.id);
    this._change();
  }

  override async import(data: T[]) {
    if (!this.db) throw new Error("Database not loaded");
    return new Promise<void>((resolve) => {
      const transaction = this.db!.transaction(["favorite"], "readwrite");
      const objectStore = transaction.objectStore("favorite");
      objectStore.clear();
      const imported: T[] = [];
      const start = new Date();
      data.forEach((value) => {
        if (imported.some((v) => v.id === value.id))
          return console.log("Duplicated", value);
        imported.push(value);
        objectStore.add({
          date: new Date(start.getTime() + imported.length),
          ...value,
        }).onsuccess = () => {
          console.log(`Imported: ${value.id}`);
        };
      });
      transaction.onabort = (ev) => {
        console.error("Import failed", ev);
      };
      transaction.onerror = (ev) => {
        console.error("Import failed", ev);
      };
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }

  override async export() {
    if (!this.db) throw new Error("Database not loaded");
    return new Promise<T[]>((resolve) => {
      const transaction = this.db!.transaction(["favorite"], "readonly");
      const objectStore = transaction.objectStore("favorite");
      const request = objectStore.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }
}

export class CacheStore<T> {
  constructor(private readonly key: string) {}

  async get(key: string): Promise<T | undefined> {
    const cache = await caches.open(this.key);
    const response = await cache.match(key);
    if (response) {
      return response.json();
    }
  }

  async set(key: string, value: T) {
    const cache = await caches.open(this.key);
    await cache.put(key, new Response(JSON.stringify(value)));
  }
}

export abstract class VirtualProvider<T> {
  public abstract readonly favorite:
    | VirtualFavoriteStore<string, "string">
    | VirtualFavoriteStore<T, "object">;

  abstract getVideo(id: string): Promise<T>;

  abstract getVideoList(page: number): Promise<List<T>>;

  abstract getVideoIdList(page: number): Promise<List<string>>;

  abstract getVideoListByUser(user: string, page: number): Promise<List<T>>;

  abstract getVideoIdListByUser(
    user: string,
    page: number
  ): Promise<List<string>>;

  abstract searchVideoList(keyword: string, page: number): Promise<List<T>>;

  abstract searchVideoIdList(
    keyword: string,
    page: number
  ): Promise<List<string>>;

  abstract resolveVideo(url: string): Promise<string>;
  abstract mirror(url: string): Promise<any>;
}

export class DefaultProvider<
  T extends { id: string }
> extends VirtualProvider<T> {
  public favorite:
    | VirtualFavoriteStore<string, "string">
    | VirtualFavoriteStore<T, "object"> = new IndexedDBStore<T>("default");
  getVideo(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  getVideoList(page: number): Promise<List<T>> {
    throw new Error("Method not implemented.");
  }
  getVideoIdList(page: number): Promise<List<string>> {
    throw new Error("Method not implemented.");
  }
  getVideoListByUser(user: string, page: number): Promise<List<T>> {
    throw new Error("Method not implemented.");
  }
  getVideoIdListByUser(user: string, page: number): Promise<List<string>> {
    throw new Error("Method not implemented.");
  }
  searchVideoList(keyword: string, page: number): Promise<List<T>> {
    throw new Error("Method not implemented.");
  }
  searchVideoIdList(keyword: string, page: number): Promise<List<string>> {
    throw new Error("Method not implemented.");
  }
  async resolveVideo(url: string): Promise<string> {
    return url;
  }
  async mirror(url: string): Promise<any> {
    const res = await fetch(url);
    return await res.blob();
    // throw new Error("Method not implemented.");
  }
}
