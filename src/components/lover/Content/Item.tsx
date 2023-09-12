import Image from "../../Image";
import { useCallback, useEffect, useRef, useState } from "react";
import { keyframes, styled } from "styled-components";
import type { VideoInfo } from "../../../libs/api/lover";
import { Lover } from "../../../libs/api";
import { $setting } from "../../../store/setting";
import Loading from "../../../assets/loading.jpg";
import { getThumbnail, translateVideoURL } from "../../../scripts/thumbnail";
import Modal from "../Modal";

type Props = {
  videoId: string;
  click?: () => void;
};

export default function Item(props: Props) {
  const [detail, setDetail] = useState<VideoInfo>();
  const [modal, setModal] = useState<boolean>(false);
  const [censored, setCensored] = useState<boolean>($setting.get().censored);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const videoRef = useRef();

  const loadThumbnail = useCallback(
    async (video: string) => {
      const res = await getThumbnail(translateVideoURL(video));
      if (typeof res === "string") return setImageUrl(res);
    },
    [setImageUrl]
  );

  useEffect(() => {
    if (detail?.id) {
      loadThumbnail(detail.video).catch(() =>
        setTimeout(() => {
          loadThumbnail(detail.video);
        }, 1000)
      );
    }
  }, [detail]);

  useEffect(() => {
    $setting.listen((setting) => {
      setCensored(setting.censored);
    });
  }, []);

  useEffect(() => {
    Lover.getVideo(props.videoId).then((res) => setDetail(res));
  }, [props.videoId]);

  return (
    <>
      <Wrapper onClick={() => setModal(true)}>
        <ImageWrapper>
          {censored ? (
            <RoundedImage src={Loading.src} fill alt={"article"} />
          ) : imageUrl ? (
            <RoundedImage src={imageUrl} fill alt={"article"} />
          ) : (
            <Gradient />
          )}
        </ImageWrapper>
        <TextWrapper>
          <Text>
            {censored ? "Good Picture 👍" : detail?.title ?? "\u00a0"}
          </Text>
        </TextWrapper>
      </Wrapper>
      {modal && detail && (
        <Modal.Detail
          close={() => setModal(false)}
          id={props.videoId}
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
