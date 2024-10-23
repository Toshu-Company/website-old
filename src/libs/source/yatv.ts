import { Yatv } from "../api";
import { IndexedDBStore, type List, DefaultProvider } from "./twitter";

export class YatvProvider extends DefaultProvider<Yatv.SearchResultVideo> {
  public readonly favorite = new IndexedDBStore<Yatv.SearchResultVideo>("yatv");
  perPage = 45;

  override async getVideo(url: string): Promise<Yatv.SearchResultVideo> {
    const data = await Yatv.getVideo(url);
    return {
      ...data,
      url,
    };
  }

  override async getVideoList(
    page: number
  ): Promise<List<Yatv.SearchResultVideo>> {
    const result = await Yatv.getIndex(page);
    return {
      videos: result,
      count: -1,
    };
  }
}
