import { useStore } from "@nanostores/react";
import styled from "styled-components";
import { $favorite } from "../../store/lover/favorite";
import HitomiContent from "../../components/hitomi/Content";
import Content from "../../components/lover/Content";

export default function Index() {
  const favorite = useStore($favorite);

  return (
    <>
      <Wrapper>
        <HitomiContent.Container>
          {favorite &&
            favorite.map((v, i) => <Content.Item key={i} videoId={v} />)}
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
