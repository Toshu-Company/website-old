import { TwiVideoNet, UraakaList } from "../api";
import {
  Twitter,
  type TwitterVideo,
  type TwitterVideoList,
  FavoriteStore,
} from "./twitter";

export class UraakaListComProvider extends Twitter {
  public readonly favorite = new FavoriteStore("uraakalist");
  override async getVideo(id: string): Promise<TwitterVideo> {
    const result = await UraakaList.getVideo(id);
    return {
      title: result.title,
      video: result.video,
      thumbnail: result.image ?? "",
      original: "",
      user: result.username,
    };
  }

  override async getVideoList(page: number): Promise<TwitterVideoList> {
    const result = await UraakaList.getIndex(page);
    return {
      videos: result.tweets.map(async (video) => {
        const res = await this.getVideo(video.id);
        return {
          ...res,
          id: video.id,
          original: video.url,
          thumbnail: video.thumbnail,
        };
      }),
      count: -1,
    };
  }

  override async searchVideoList(
    keyword: string,
    page: number
  ): Promise<TwitterVideoList> {
    const result = await UraakaList.getSearch(keyword, page);
    return {
      videos: result.tweets.map(async (video) => {
        const res = await this.getVideo(video.id);
        return {
          ...res,
          id: video.id,
          original: video.url,
          thumbnail: video.thumbnail,
        };
      }),
      count: -1,
    };
  }
}
