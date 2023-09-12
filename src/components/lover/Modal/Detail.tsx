import { styled } from "styled-components";
import { useEffect, useRef, useState } from "react";
import Modal from "../../Modal";
import Favorite from "../Content/Favorite";
import type { VideoInfo } from "../../../libs/api/lover";
import { $setting as $twitter } from "../../../store/twitter/setting";
import { $setting as $common } from "../../../store/setting";
import { translateVideoURL } from "../../../scripts/thumbnail";
import Hls from "hls.js";

type Props = {
  close: () => void;
  id: string;
  detail: VideoInfo;
};

export default function Detail({ close, id, detail }: Props) {
  const [censored, setCensored] = useState<boolean>();
  const [autoPlay, setAutoPlay] = useState<boolean>($twitter.get().autoPlay);
  const [loop, setLoop] = useState<boolean>($twitter.get().loop);

  const videoRef = useRef<HTMLVideoElement>(null);

  $common.listen((setting) => {
    setCensored(setting.censored);
  });
  $twitter.listen((setting) => {
    setAutoPlay(setting.autoPlay);
    setLoop(setting.loop);
  });

  useEffect(() => {
    if (!censored && Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
        maxBufferLength: 60 * 60,
      });
      hls.loadSource(translateVideoURL(detail.video));
      hls.attachMedia(videoRef.current);
    }
  }, []);

  return (
    <>
      <Modal.Default maxWidth={1200} close={close}>
        <Wrapper>
          <Video
            ref={videoRef}
            controls
            autoFocus
            loop={loop}
            autoPlay={autoPlay}
          >
            {censored && (
              <source src="https://youtu.be/0bIRwBpBcZQ" type="video/mp4" />
            )}
          </Video>
          <TopRow>
            <Menu>
              <Favorite videoId={id} />
            </Menu>
          </TopRow>
          <ExternalLink href={detail.webpage_url} target="_blank">
            <Title>
              {censored ? "Good Picture 👍" : detail.title ?? "\u00a0"}
            </Title>
          </ExternalLink>
        </Wrapper>
      </Modal.Default>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
`;

const TopRow = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const User = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: white;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: white;
  white-space: pre-wrap;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const ExternalLink = styled.a``;
