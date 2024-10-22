import { useStore } from "@nanostores/react";
import styled from "styled-components";
import { $favorite } from "../../../store/twitter/favorite";
import Content from "../../../components/twitter/Content";
import { Providers } from "../../../libs/source";
import { useMemo } from "react";

interface Props {
  provider: keyof typeof Providers;
}

export default function Index(props: Props) {
  const provider = useMemo(() => new Providers[props.provider](), []);
  const favorite = useStore(provider.favorite.favorite);

  return (
    <>
      <Wrapper>
        <Content.Container>
          {favorite &&
            favorite.map((v, i) => (
              <Content.Item
                provider={provider}
              key={v}
                detail={provider.getVideo(v)}
              />
            ))}
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
