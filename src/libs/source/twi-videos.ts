import { TwiVideosNet } from "../api";
import { Extended } from "../api/twi-videos.net";
import {
  Twitter,
  type List,
  type TwitterVideo,
  type TwitterVideoList,
  FavoriteStore,
} from "./twitter";

export class TwiVideosNetProvider extends Twitter {
  public readonly favorite = new FavoriteStore("twivideos");
  async getVideo(id: string): Promise<TwitterVideo> {
    const detail = await TwiVideosNet.getDetail(id);
    if (Extended.isExtendedVideoDetail(detail)) {
      return {
        id: detail.id_str,
        title: detail.title,
        user: detail.uploader,
        user_id: detail.uploader_id,
        user_url: detail.uploader_url,
        video: detail.url,
        thumbnail: detail.thumbnails[1].url,
        original: detail.webpage_url,
        raw: detail,
      };
    }
    return {
      id: detail.data.id,
      title: detail.title,
      user: detail.uploader,
      user_url: detail.uploader_url,
      // video: detail.video?.[1] ?? detail.url[1],
      video: detail.url[1],
      thumbnail: detail.thumbnails[1].url,
      original: detail.webpage_url,
      raw: detail,
    };
  }

  async getVideoList(page: number): Promise<TwitterVideoList> {
    const result = await TwiVideosNet.getIndex(page);
    return {
      videos: result.videos.map(async (video) => await this.getVideo(video.id)),
      count: result.count,
    };
  }

  async getVideoIdList(page: number): Promise<List<string>> {
    const result = await TwiVideosNet.getIndex(page);
    return {
      videos: result.videos.map((video) => video.id),
      count: result.count,
    };
  }

  async getVideoListByUser(
    user: string,
    page: number
  ): Promise<TwitterVideoList> {
    const result = await TwiVideosNet.getSearchUser(user, page);
    return {
      videos: result.videos.map(async (video) => await this.getVideo(video.id)),
      count: result.count,
    };
  }

  async searchVideoList(
    keyword: string,
    page: number
  ): Promise<TwitterVideoList> {
    const result = await TwiVideosNet.getSearch(keyword, page);
    return {
      videos: result.videos.map(async (video) => await this.getVideo(video.id)),
      count: result.count,
    };
  }
}
