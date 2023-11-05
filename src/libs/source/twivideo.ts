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
    return JSON.parse(atob(id));
  }

  override async getVideoList(page: number): Promise<TwitterVideoList> {
    const result = await TwiVideoNet.getIndex(
      (page - 1) * this.perPage,
      this.perPage
    );
    return {
      videos: result
        .map((video) => ({
          video: video.video,
          thumbnail: video.thumbnail,
          original: video.twitter,
          raw: video,
        }))
        .map((video) => ({
          ...video,
          id: btoa(JSON.stringify(video)),
        })),
      count: -1,
    };
  }

  override async resolveVideo(url: string): Promise<string> {
    return await TwiVideoNet.mirror(url);
  }
}
