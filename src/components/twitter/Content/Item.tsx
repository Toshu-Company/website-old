import { keyframes, styled } from "styled-components";
import Image from "../../Image";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { $setting } from "../../../store/setting";
import Loading from "../../../assets/loading.jpg";
import type {
  TwitterVideo,
  VirtualProvider,
} from "../../../libs/source/twitter";
import { useStore } from "@nanostores/react";
import { cachingThumbnail } from "../../../scripts/cache";

type Props = {
  provider: VirtualProvider<TwitterVideo>;
  detail: TwitterVideo | Promise<TwitterVideo>;
  click?: () => void;
};

export default function Item(props: Props) {
  const { censored } = useStore($setting);
  const [detail, setDetail] = useState<TwitterVideo>();
  const [modal, setModal] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string>();

  useEffect(() => {
    if (props.detail instanceof Promise) {
      props.detail.then((res) => setDetail(res));
    } else {
      setDetail(props.detail);
    }
  }, [props.detail]);

  useEffect(() => {
    if (detail?.thumbnail) {
      cachingThumbnail(detail.thumbnail).then((blob) => {
        setThumbnail(URL.createObjectURL(blob));
      });
    }
  }, [detail?.thumbnail]);

  return (
    <>
      <Wrapper onClick={() => setModal(true)}>
        <ImageWrapper>
          {censored ? (
            <RoundedImage src={Loading.src} fill alt={"article"} />
          ) : thumbnail ? (
            <RoundedImage src={thumbnail} fill alt={"article"} />
          ) : (
            <Gradient />
          )}
        </ImageWrapper>
        <TextWrapper>
          <Text>{detail?.user ? `@${detail?.user}` : "\u00a0"}</Text>
        </TextWrapper>
      </Wrapper>
      {modal && detail && (
        <Modal.Detail
          provider={props.provider}
          close={() => setModal(false)}
          detail={detail}
        />
      )}
    </>
  );
}

const Animation = keyframes`
  from {
    opacity: 0.3;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const Wrapper = styled.button`
  width: 244px;
  height: 284px;
  border-radius: 10px;

  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: #313131;
  transition: all 0.1s ease-in-out;

  @media (max-width: 772px) {
    width: calc(50% - 10px);
    aspect-ratio: 1;
    height: auto;
  }

  /* animation: ${Animation} 0.5s ease-in-out; */

  &:hover {
    opacity: 0.8;
    transform: translateY(-5px);
  }

  &:active {
    opacity: 0.6;
    transform: translateY(0px);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 244px;
  border-radius: 8px;

  @media (max-width: 772px) {
    aspect-ratio: 1 / 1;
    height: auto;
    overflow: hidden;
  }
`;

const TextWrapper = styled.div`
  width: 100%;
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.p`
  min-height: 18px;
  font-size: 16px;
  font-weight: 500;
  color: #dbdbdb;

  @media (max-width: 772px) {
    font-size: 14px;
  }
`;

const RoundedImage = styled(Image)`
  border-radius: 8px 8px 0 0;
`;

const Gradient = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent, #000);
`;
