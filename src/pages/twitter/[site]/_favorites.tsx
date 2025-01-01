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
    const data = await Promise.all(
      old.export().map((v) => provider.getVideo(v))
    );
    console.log(data);
    if (provider.favorite.Type === "object") {
      console.log("object");
      await provider.favorite.import(data);
      console.log("imported");
    }
  };

  const _export = async () => {
    const data = await provider.favorite.export();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.provider}.json`;
    a.click();
  };

  const _import = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = JSON.parse(e.target!.result as string);
      await provider.favorite.import(data);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Wrapper>
        <div>
          <button onClick={() => migrate()}>Migrate</button>
          <button onClick={() => _export()}>Export</button>
          <button onClick={() => document.getElementById("file")?.click()}>
            Import
          </button>
          <input
            id="file"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => _import(e.target.files![0])}
          />
        </div>
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
