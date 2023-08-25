import { keyframes, styled } from "styled-components";
import Image from "../Image";
import { useEffect, useState } from "react";
import type { Extended, VideoDetail } from "../../libs/api/twi-videos.net";
import { TwiVideosNet } from "../../libs/api";
import { isSchool } from "../../libs/school";
import Modal from "../Modal";

type Props = {
  videoId: string;
  click?: () => void;
};

export default function Item(props: Props) {
  const [detail, setDetail] = useState<
    VideoDetail | Extended.VideoDetailExtend
  >();
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    TwiVideosNet.getDetail(props.videoId).then((res) => setDetail(res));
  }, [props.videoId]);

  console.log(detail);

  return (
    <>
      <Wrapper onClick={() => setModal(true)}>
        <ImageWrapper>
          {isSchool() ? (
            <RoundedImage
              src={
                "https://cdn.pixabay.com/photo/2017/01/26/18/09/length-landscape-2011238_1280.jpg"
              }
              fill
              alt={"article"}
            />
          ) : (
            <RoundedImage
              src={
                detail?.thumbnails[1].url ??
                "https://cdn.pixabay.com/photo/2017/01/26/18/09/length-landscape-2011238_1280.jpg"
              }
              fill
              alt={"article"}
            />
          )}
        </ImageWrapper>
        <TextWrapper>
          <Text>{detail?.uploader}</Text>
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

  animation: ${Animation} 0.5s ease-in-out;

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
