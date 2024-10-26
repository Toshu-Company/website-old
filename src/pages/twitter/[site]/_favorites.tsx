import styled from "styled-components";
import Content from "../../../components/twitter/Content";
import { Providers } from "../../../libs/source";
import { useMemo } from "react";
import { PersistentStore } from "../../../libs/source/twitter";

interface Props {
  provider: keyof typeof Providers;
}

export default function Index(props: Props) {
  const provider = useMemo(() => new Providers[props.provider](), []);
  const favorites = provider.favorite.use("react");

  const migrate = async () => {
    const old = new PersistentStore("twivideo");
    const data = (await Promise.all(old.export().map((v) => provider.getVideo(v))));
    console.log(data);
    if (provider.favorite.Type === "object") {
      console.log("object");
      await provider.favorite.import(data);
      console.log("imported");
    }
  }

  return (
    <>
      <Wrapper>
        <button onClick={() => migrate()}>Migrate</button>
        <Content.Container>
          {favorites.map((v, i) => (
            <Content.Item
              provider={provider}
              key={typeof v === "string" ? v : v.id}
              detail={typeof v === "string" ? provider.getVideo(v) : v}
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
