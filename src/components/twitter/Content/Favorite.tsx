import { styled } from "styled-components";
import { useStore } from "@nanostores/react";
import Image from "../../Image";
import HeartIcon from "../../../assets/heart.svg";
import HeartFillIcon from "../../../assets/heart-fill.svg";
import type { TwitterVideo, VirtualTwitter } from "../../../libs/source/twitter";
import { useEffect, useState } from "react";

type Props = {
  provider: VirtualTwitter;
  detail: TwitterVideo;
};

export default function Favorite(props: Props) {
  const { provider, detail } = props;
  const { favorite } = provider;
  favorite.use('react');

  const [favorited, setFavorited] = useState<boolean>();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (favorite.Type === "object") {
        const result = await favorite.includes(detail);
        setFavorited(result);
      } else {
        const result = await favorite.includes(detail.id);
        setFavorited(result);
      }
    };

    fetchFavoriteStatus();
  });

  return (
    <ImageButton
      onClick={async () => {
        if (favorite.Type === "object") {
          if (await favorite.includes(detail)) {
            await favorite.remove(detail);
          } else {
            await favorite.add(detail);
          }
        } else {
          if (await favorite.includes(detail.id)) {
            await favorite.remove(detail.id);
          } else {
            await favorite.add(detail.id);
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
