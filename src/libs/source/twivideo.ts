import { TwiVideoNet } from "../api";
import {
  Twitter,
  type List,
  type TwitterVideo,
  type TwitterVideoList,
} from "./twitter";

export class TwiVideoNetProvider extends Twitter {
  perPage = 45;

  async getVideoList(page: number): Promise<TwitterVideoList> {
    const result = await TwiVideoNet.getIndex(
      (page - 1) * this.perPage,
      this.perPage
    );
    return {
      videos: result.map((video) => ({
        video: video.video,
        thumbnail: video.thumbnail,
        original: video.twitter,
      })),
      count: -1,
    };
  }
}
