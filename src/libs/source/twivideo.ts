import { TwiVideoNet } from "../api";
import {
  Twitter,
  type TwitterVideoList,
  FavoriteStore,
  type TwitterVideo,
} from "./twitter";

export class TwiVideoNetProvider extends Twitter {
  public readonly favorite = new FavoriteStore(
    "twivideo",
    (a, b) => this._getVideo(a).original === this._getVideo(b).original
  );
  perPage = 45;

  private _getVideo(id: string): TwitterVideo {
    const object = JSON.parse(atob(id));
    if ("raw" in object) {
      return object;
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
    return {
      videos: result.map((video) => this.videoInfoToTwitterVideo(video)),
      count: -1,
    };
  }

  private videoInfoToTwitterVideo(video: TwiVideoNet.VideoInfo): TwitterVideo {
    const user = /https?:\/\/(?:x|twitter)\.com\/([a-zA-Z0-9_]+)\//.exec(
      video.twitter ?? (video as any).original
    )?.[1];
    return {
      video: video.video,
      thumbnail: video.thumbnail,
      original: video.twitter ?? (video as any).original,
      user: user,
      user_id: user,
      user_url: `https://x.com/${user}/`,
      raw: video,
      id: btoa(JSON.stringify(video)),
    };
  }

  // override async resolveVideo(url: string): Promise<string> {
  //   return await TwiVideoNet.mirror(url);
  // }
}
