import styled from "styled-components";
import HitomiContent from "../../components/hitomi/Content";
import Content from "../../components/lover/Content";
import { useCallback, useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../libs/observer";
import type { SearchResultVideo } from "../../libs/api/lover";
import { Lover } from "../../libs/api";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export default function Index() {
  const [videos, setVideos] = useState<SearchResultVideo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [observe, unobserve] = useIntersectionObserver(
    () => setPage((page) => page + 1),
    {
      threshold: 1,
    }
  );

  const loading = useRef(true);
  const target = useRef(null);

  const fetch = useCallback(
    async (page: number, videos: SearchResultVideo[]) =>
      new Promise((resolve) => {
        Lover.getIndex(page).then((res) => {
          setVideos(videos.concat(res.videos));
          resolve(videos.concat(res.videos));
        });
      }),
    []
  );

  useEffect(() => {
    const targetNode = target.current;
    if (targetNode) observe(targetNode);
    return () => {
      if (targetNode) unobserve(targetNode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(page, videos).then(() => {
      loading.current = false;
    });
  }, [page]);

  return (
    <>
      <Wrapper>
        <HitomiContent.Container>
          {loading.current
            ? [...Array(20)].map((_, i) => <HitomiContent.Skeleton key={i} />)
            : videos.map((v, i) => <Content.Item key={i} videoId={v.id} />)}
          {/* <Content.Item videoId={"41300"} /> */}
          <Intersection
            id="intersection"
            ref={target}
            $visible={videos.length > 0}
          >
            Loading...
          </Intersection>
        </HitomiContent.Container>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  padding-top: 20px;
  margin-bottom: 20px;
`;

const Intersection = styled.div<{
  $visible: boolean;
}>`
  width: 100%;
  height: 100px;
  text-align: center;
  display: ${(props) => (props.$visible ? "block" : "none")};
`;
