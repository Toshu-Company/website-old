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
  const [user, setUser] = useState<string>("");

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
      user: string | null,
      page: number,
      videos: List<TwitterVideo>["videos"]
    ) => {
      if (user) {
        provider
          .searchVideoList(user, page)
          .then((res) => {
            setVideos(videos.concat(res.videos));
          })
          .catch((e) => {
            alert(e);
          });
      }
    },
    []
  );

  const target = useRef(null);
  const prevUser = useRef<string | null>(null);

  useEffect(() => {
    const targetNode = target.current;
    if (targetNode) observe(targetNode);
    return () => {
      if (targetNode) unobserve(targetNode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUser(params.get("user") ?? "");
  }, []);

  useEffect(() => {
    if (prevUser.current !== user) {
      setPage(1);
      prevUser.current = user;
      fetch(user, 1, []);
    } else {
      fetch(user, page, videos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user]);

  return (
    <>
      <Wrapper>
        <Content.Container>
          {videos && videos.map((v, i) => <Content.Item key={i} detail={v} />)}
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
