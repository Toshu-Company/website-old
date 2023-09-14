import { styled } from "styled-components";
import { useState } from "react";
import Modal from "../../Modal";
import Favorite from "../Content/Favorite";
import { Extended, type VideoDetail } from "../../../libs/api/twi-videos.net";
import { $setting as $twitter } from "../../../store/twitter/setting";
import { $setting as $common } from "../../../store/setting";
import type { TwitterVideo } from "../../../libs/source/twitter";

type Props = {
  close: () => void;
  id?: string;
  detail: TwitterVideo;
};

export default function Detail({ close, id, detail }: Props) {
  const [censored, setCensored] = useState<boolean>();
  const [autoPlay, setAutoPlay] = useState<boolean>($twitter.get().autoPlay);
  const [loop, setLoop] = useState<boolean>($twitter.get().loop);

  $common.listen((setting) => {
    setCensored(setting.censored);
  });
  $twitter.listen((setting) => {
    setAutoPlay(setting.autoPlay);
    setLoop(setting.loop);
  });

  return (
    <>
      <Modal.Default maxWidth={1200} close={close}>
        <Wrapper>
          <Video controls autoFocus loop={loop} autoPlay={autoPlay}>
            <source
              src={censored ? "https://youtu.be/0bIRwBpBcZQ" : detail.video}
              type="video/mp4"
            />
          </Video>
          <TopRow>
            <User>
              <a href={`/twitter/user?user=${detail.user_id}`}>{detail.user}</a>
            </User>
            <Menu>{id && <Favorite id={id} />}</Menu>
          </TopRow>
          <ExternalLink href={detail.original} target="_blank">
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
