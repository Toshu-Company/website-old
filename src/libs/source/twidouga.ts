import { TwiDougaNet } from "../api";
import {
  type TwitterVideoList,
  type TwitterVideo,
  IndexedDBStore,
  DefaultProvider,
} from "./twitter";

export class TwiDougaNetProvider extends DefaultProvider<TwitterVideo> {
  public readonly favorite = new IndexedDBStore<TwitterVideo>("twidouga");

  private _getVideo(id: string): TwitterVideo {
    const object = JSON.parse(atob(id));
    return this.videoInfoToTwitterVideo(object);
  }

  override async getVideo(id: string): Promise<TwitterVideo> {
    return this._getVideo(id);
  }

  override async getVideoList(page: number): Promise<TwitterVideoList> {
    if (page !== 1)
      return {
        videos: [],
        count: -1,
      };
    const result = await TwiDougaNet.getIndex();
    return {
      videos: result.map((video) => this.videoInfoToTwitterVideo(video)),
      count: -1,
    };
  }

  private videoInfoToTwitterVideo(video: TwiDougaNet.VideoInfo): TwitterVideo {
    const match =
      /https?:\/\/(?:x|twitter)\.com\/([a-zA-Z0-9_]+)\/(?:status\/(\d+))?/.exec(
        video.twitterUrl ?? (video as any).original
      );
    const user = match?.[1];
    const id = match?.[2];
    return {
      video: video.url,
      thumbnail: video.thumbnail,
      original: video.twitterUrl ?? (video as any).original,
      user: user,
      user_id: user,
      user_url: user ? `https://x.com/${user}/` : undefined,
      raw: video,
      id: id ?? video.twitterUrl,
    };
  }
}
