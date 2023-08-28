import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../libs/observer";
import { Hitomi } from "../../libs/api";
import Content from "../../components/hitomi/Content";

export default function Index() {
  const [search, setSearch] = useState<string>("");

  const [indexes, setIndexes] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [observe, unobserve] = useIntersectionObserver(
    () => setPage((page) => page + 1),
    {
      threshold: 1,
    }
  );

  const fetch = useCallback(
    async (search: string | null, page: number, indexes: number[]) =>
      new Promise((resolve) => {
        if (search) {
          Hitomi.getSearch(search, page).then((res) => {
            setIndexes(indexes.concat(res));
            resolve(indexes.concat(res));
          });
        } else {
          Hitomi.getIndexes(page).then((res) => {
            setIndexes(indexes.concat(res));
            resolve(indexes.concat(res));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      fetch(search, page, indexes).then(() => {
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
            : indexes.map((v, i) => <Content.Item key={i} index={v} />)}
          <Intersection
            id="intersection"
            ref={target}
            $visible={indexes.length > 0}
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
