import { styled } from "styled-components";
import { useStore } from "@nanostores/react";
import Image from "../../Image";
import { $favorite } from "../../../store/lover/favorite";
import HeartIcon from "../../../assets/heart.svg";
import HeartFillIcon from "../../../assets/heart-fill.svg";

type Props = {
  id: string;
};

export default function Favorite(props: Props) {
  const favorite = useStore($favorite);

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
