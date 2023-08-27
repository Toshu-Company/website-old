import { useStore } from "@nanostores/react";
import styled from "styled-components";
import { $favorite } from "../../store/twitter/favorite";
import Content from "../../components/Content";

export default function Index() {
  const favorite = useStore($favorite);

  return (
    <>
      <Wrapper>
        <Content.Container>
          {favorite &&
            favorite.map((v, i) => <Content.Item key={i} videoId={v} />)}
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
