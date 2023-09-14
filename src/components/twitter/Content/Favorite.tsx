import { styled } from "styled-components";
import { useStore } from "@nanostores/react";
import Image from "../../Image";
import HeartIcon from "../../../assets/heart.svg";
import HeartFillIcon from "../../../assets/heart-fill.svg";
import type { VirtualTwitter } from "../../../libs/source/twitter";

type Props = {
  provider: VirtualTwitter;
  id: string;
};

export default function Favorite(props: Props) {
  const $favorite = props.provider.favorite.favorite;
  const favorite = useStore(props.provider.favorite.favorite);

  return (
    <ImageButton
      onClick={() => {
        if (favorite.includes(props.id)) {
          $favorite.set(favorite.filter((id) => id !== props.id));
        } else {
          $favorite.set(favorite.concat(props.id));
        }
      }}
    >
      <Image
        src={favorite.includes(props.id) ? HeartFillIcon.src : HeartIcon.src}
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
