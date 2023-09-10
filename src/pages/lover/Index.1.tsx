import { useRef } from "react";
import { Wrapper } from ".";

export default function Index() {
  const [page, setPage] = useState<number>(1);

  const loading = useRef(false);

  return (
    <>
      <Wrapper>
        {/* <Content.Container>{loading}</Content.Container> */}
      </Wrapper>
    </>
  );
}
