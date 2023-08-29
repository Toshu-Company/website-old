import { styled } from "styled-components";
import { useStore } from "@nanostores/react";
import Image from "../../Image";
import { $favorite } from "../../../store/hitomi/favorite";
import HeartIcon from "../../../assets/heart.svg";
import HeartFillIcon from "../../../assets/heart-fill.svg";

type Props = {
  videoId: string;
};

export default function Favorite(props: Props) {
  const favorite = useStore($favorite);

  return (
    <ImageButton
      onClick={() => {
        if (favorite.includes(props.videoId)) {
          $favorite.set(favorite.filter((id) => id !== props.videoId));
        } else {
          $favorite.set(favorite.concat(props.videoId));
        }
      }}
    >
      <Image
        src={
          favorite.includes(props.videoId) ? HeartFillIcon.src : HeartIcon.src
        }
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
