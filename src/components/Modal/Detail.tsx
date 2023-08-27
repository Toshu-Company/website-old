import { styled } from "styled-components";
import { useState } from "react";
import Modal from ".";
import Favorite from "../Content/Favorite";
import { isSchool } from "../../libs/school";
import { Extended, VideoDetail } from "../../libs/api/twi-videos.net";
import { $setting } from "../../store/twitter/setting";

type Props = {
  close: () => void;
  id: string;
  detail: VideoDetail | Extended.VideoDetailExtend;
};

export default function Detail({ close, id, detail }: Props) {
  const [censored, setCensored] = useState<boolean>(isSchool());
  const [autoPlay, setAutoPlay] = useState<boolean>($setting.get().autoPlay);
  const [loop, setLoop] = useState<boolean>($setting.get().loop);

  $setting.listen((setting) => {
    setCensored(setting.censored);
    setAutoPlay(setting.autoPlay);
    setLoop(setting.loop);
  });

  return (
    <>
      <Modal.Default maxWidth={1200} close={close}>
        <Wrapper>
          <Video controls autoFocus loop={loop} autoPlay={autoPlay}>
            <source
              src={
                censored
                  ? "https://youtu.be/0bIRwBpBcZQ"
                  : Extended.isExtendedVideoDetail(detail)
                  ? detail.url
                  : detail.url[1]
              }
              type="video/mp4"
            />
          </Video>
          <TopRow>
            <User>
              <a href={`/twitter/user?user=${detail.uploader_id}`}>
                {detail.uploader}
              </a>
            </User>
            <Menu>
              <Favorite videoId={id} />
            </Menu>
          </TopRow>
          <ExternalLink href={detail.webpage_url} target="_blank">
            <Title>{detail.title}</Title>
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
