import styled from "styled-components";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useIntersectionObserver from "../../../libs/observer";
import Content from "../../../components/twitter/Content";
import type { List, TwitterVideo } from "../../../libs/source/twitter";
import { Providers } from "../../../libs/source";

interface Props {
  provider: keyof typeof Providers;
}

export default function Index(props: Props) {
  const provider = useMemo(() => new Providers[props.provider](), []);
  const search = new URLSearchParams(window.location.search).get("search") ?? "";

  const [videos, setVideos] = useState<List<TwitterVideo>["videos"]>([]);
  const [page, setPage] = useState<number>(1);
  const [observe, unobserve] = useIntersectionObserver(
    () => setPage((page) => page + 1),
    {
      threshold: 1,
    }
  );

  const fetch = useCallback(
    async (
      search: string | null,
      page: number,
    ) => {
      if (search) {
        const data = await provider.searchVideoList(search, page);
        setVideos((videos) => videos.concat(data.videos));
      } else {
        const data = await provider.getVideoList(page);
        setVideos((videos) => videos.concat(data.videos));
      }
    },
    []
  );

  const target = useRef(null);

  useEffect(() => {
    const targetNode = target.current;
    if (targetNode) observe(targetNode);
    return () => {
      if (targetNode) unobserve(targetNode);
    };
  }, []);

  useEffect(() => {
    fetch(search, page).then(() => {
      console.log("fetch");
    });
  }, [page]);

  return (
    <>
      <Wrapper>
        <Content.Container>
          {videos.length === 0
            ? [...Array(20)].map((_, i) => <Content.Skeleton key={i} />)
            : videos.map((v, i) => (
              <Content.Item provider={provider} key={i} detail={v} />
            ))}
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
