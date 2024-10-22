import { TwiVideoNet } from "../api";
import {
  Twitter,
  type TwitterVideoList,
  FavoriteStore,
  type TwitterVideo,
} from "./twitter";

export class TwiVideoNetProvider extends Twitter {
  public readonly favorite = new FavoriteStore("twivideo");
  perPage = 45;

  override async getVideo(id: string): Promise<TwitterVideo> {
    const object = JSON.parse(atob(id));
    if ("raw" in object) {
      return object;
    }
    return this.videoInfoToTwitterVideo(object);
  }

  override async getVideoList(page: number): Promise<TwitterVideoList> {
    const result = await TwiVideoNet.getIndex(
      (page - 1) * this.perPage,
      this.perPage
    );
    return {
      videos: result.map((video) => {
        const user = /https?:\/\/x\.com\/([a-zA-Z0-9_]+)\//.exec(
          video.twitter
        )?.[1];
        return {
          video: video.video,
          thumbnail: video.thumbnail,
          original: video.twitter,
          user: user,
          user_id: user,
          user_url: `https://x.com/${user}/`,
          raw: video,
          id: btoa(JSON.stringify(video)),
        };
      }),
      count: -1,
    };
  }

  private videoInfoToTwitterVideo(video: TwiVideoNet.VideoInfo) {
    const user = /https?:\/\/x\.com\/([a-zA-Z0-9_]+)\//.exec(
      video.twitter
    )?.[1];
    return {
      video: video.video,
      thumbnail: video.thumbnail,
      original: video.twitter,
      user: user,
      user_id: user,
      user_url: `https://x.com/${user}/`,
      raw: video,
    };
  }

  // override async resolveVideo(url: string): Promise<string> {
  //   return await TwiVideoNet.mirror(url);
  // }
}
