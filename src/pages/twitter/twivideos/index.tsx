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
  const [search, setSearch] = useState<string>("");

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
      videos: List<TwitterVideo>["videos"]
    ) =>
      new Promise((resolve) => {
        if (search) {
          provider.searchVideoList(search, page).then((res) => {
            setVideos(videos.concat(res.videos));
            resolve(videos.concat(res.videos));
          });
        } else {
          provider.getVideoList(page).then((res) => {
            setVideos(videos.concat(res.videos));
            resolve(videos.concat(res.videos));
          });
        }
      }),
    []
  );

  const target = useRef(null);
  const prevSearch = useRef<string | null>(null);
  const loading = useRef<boolean>(true);

  useEffect(() => {
    const targetNode = target.current;
    if (targetNode) observe(targetNode);
    return () => {
      if (targetNode) unobserve(targetNode);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") ?? "");
  }, []);

  useEffect(() => {
    if (prevSearch.current !== search) {
      setPage(1);
      prevSearch.current = search;
      fetch(search, 1, []).then(() => {
        console.log("fetch");
        loading.current = false;
      });
    } else {
      fetch(search, page, videos).then(() => {
        console.log("fetch");
        loading.current = false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  return (
    <>
      <Wrapper>
        <Content.Container>
          {loading.current
            ? [...Array(20)].map((_, i) => <Content.Skeleton key={i} />)
            : videos.map((v, i) => <Content.Item key={i} detail={v} />)}
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
