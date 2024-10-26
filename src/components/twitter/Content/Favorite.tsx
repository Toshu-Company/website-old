import { styled } from "styled-components";
import { useStore } from "@nanostores/react";
import Image from "../../Image";
import HeartIcon from "../../../assets/heart.svg";
import HeartFillIcon from "../../../assets/heart-fill.svg";
import type { TwitterVideo, VirtualProvider } from "../../../libs/source/twitter";
import { useEffect, useMemo, useState } from "react";

type Props = {
  provider: VirtualProvider<TwitterVideo>;
  detail: TwitterVideo;
};

export default function Favorite(props: Props) {
  const { provider, detail } = props;
  const { favorite: store } = provider;
  const favorites = store.use('react');

  const favorited = useMemo(() => {
    if (store.Type === "object") {
      return (favorites as TwitterVideo[]).some((v) => v.id === detail.id);
    } else {
      return (favorites as string[]).includes(detail.id);
    }
  }, [favorites]);

  return (
    <ImageButton
      onClick={() => {
        if (store.Type === "object") {
          if (store.includes(detail)) {
            store.remove(detail);
          } else {
            store.add(detail);
          }
        } else {
          if (store.includes(detail.id)) {
            store.remove(detail.id);
          } else {
            store.add(detail.id);
          }
        }
      }}
    >
      <Image
        src={favorited ? HeartFillIcon.src : HeartIcon.src}
        width={[24, { responsive: 768, size: 20 }]}
        alt="Favorites"
        responsive
      />
    </ImageButton>
  );
}

const ImageButton = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
`;
