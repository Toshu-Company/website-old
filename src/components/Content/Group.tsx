import { TwiVideosNet } from "@/app/lib/api";
import { SearchResultVideo } from "@/app/lib/api/twi-videos.net";
import useIntersectionObserver from "@/app/lib/observer";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Item from "./Item";

type Props = {
  page: number;
  fetch: (page: number) => Promise<TwiVideosNet.SearchResult>;
};

export function Group({ page, fetch }: Props) {
  const [videos, setVideos] = useState<SearchResultVideo[]>([]);

  useEffect(() => {
    fetch(page).then((res) => {
      setVideos(res.videos);
    });
  }, [fetch, page]);

  return (
    <>
      {videos.map((v, i) => (
        <Item key={i} videoId={v.id} />
      ))}
    </>
  );
}
