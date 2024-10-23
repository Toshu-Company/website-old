import { TwiVideoNet } from "../api";
import {
  Twitter,
  type TwitterVideoList,
  type TwitterVideo,
  IndexedDBStore,
  CacheStore,
} from "./twitter";

export class TwiVideoNetProvider extends Twitter {
  public readonly favorite = new IndexedDBStore("twivideo");
  private readonly cache = new CacheStore("twivideo");
  perPage = 45;

  private _getVideo(id: string): TwitterVideo {
    const object = JSON.parse(atob(id));
    if ("raw" in object) {
      return this.videoInfoToTwitterVideo(object.raw);
    }
    return this.videoInfoToTwitterVideo(object);
  }

  override async getVideo(id: string): Promise<TwitterVideo> {
    return this._getVideo(id);
  }

  override async getVideoList(page: number): Promise<TwitterVideoList> {
    const result = await TwiVideoNet.getIndex(
      (page - 1) * this.perPage,
      this.perPage
    );
    this.cache.set(`index-${page}-${new Date().toLocaleDateString()}`, result);
    return {
      videos: result.map((video) => this.videoInfoToTwitterVideo(video)),
      count: -1,
    };
  }

  private videoInfoToTwitterVideo(video: TwiVideoNet.VideoInfo): TwitterVideo {
    const match =
      /https?:\/\/(?:x|twitter)\.com\/([a-zA-Z0-9_]+)\/(?:status\/(\d+))?/.exec(
        video.twitter ?? (video as any).original
      );
    const user = match?.[1];
    const id = match?.[2];
    return {
      video: video.video,
      thumbnail: video.thumbnail,
      original: video.twitter ?? (video as any).original,
      user: user,
      user_id: user,
      user_url: user ? `https://x.com/${user}/` : undefined,
      raw: video,
      id: id ?? video.twitter,
    };
  }

  // override async resolveVideo(url: string): Promise<string> {
  //   return await TwiVideoNet.mirror(url);
  // }
}
