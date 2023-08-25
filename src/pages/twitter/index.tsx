import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchResultVideo } from "../../libs/api/twi-videos.net";
import useIntersectionObserver from "../../libs/observer";
import { TwiVideosNet } from "../../libs/api";
import Content from "../../components/Content";

export default function Index() {
  const params =
    URLSearchParams && window
      ? new URLSearchParams(window.location.search)
      : ({} as any);
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [videos, setVideos] = useState<SearchResultVideo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [observe, unobserve] = useIntersectionObserver(
    () => setPage((page) => page + 1),
    {
      threshold: 1,
    }
  );

  const fetch = useCallback(
    async (
      userId: string | null,
      page: number,
      videos: SearchResultVideo[]
    ) => {
      if (userId) {
        TwiVideosNet.getSearchUser(userId, page).then((res) => {
          setVideos(videos.concat(res.videos));
        });
      } else {
        TwiVideosNet.getIndex(page).then((res) => {
          setVideos(videos.concat(res.videos));
        });
      }
    },
    []
  );

  const target = useRef(null);
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    const targetNode = target.current;
    if (targetNode) observe(targetNode);
    return () => {
      if (targetNode) unobserve(targetNode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevUserId.current !== userId) {
      setPage(1);
      prevUserId.current = userId;
      fetch(userId, 1, []);
    } else {
      fetch(userId, page, videos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, userId]);

  return (
    <>
      <Wrapper>
        <Content.Container>
          {videos &&
            videos.map((v, i) => <Content.Item key={i} videoId={v.id} />)}
          <Intersection
            id="intersection"
            ref={target}
            $visible={videos.length > 0}
          >
            Loading...
          </Intersection>
        </Content.Container>
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
