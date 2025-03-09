import { styled } from "styled-components";
import { useEffect, useState } from "react";
import Modal from "../../Modal";
import Favorite from "../Content/Favorite";
import { $setting as $twitter } from "../../../store/twitter/setting";
import { $setting as $common } from "../../../store/setting";
import type {
  TwitterVideo,
  VirtualProvider,
} from "../../../libs/source/twitter";
import { useStore } from "@nanostores/react";

type Props = {
  close: () => void;
  detail: TwitterVideo;
  provider: VirtualProvider<TwitterVideo>;
};

export default function Detail({ close, detail, provider }: Props) {
  const [url, setUrl] = useState<string>();
  const [censored, setCensored] = useState<boolean>();
  const [autoPlay, setAutoPlay] = useState<boolean>($twitter.get().autoPlay);
  const [loop, setLoop] = useState<boolean>($twitter.get().loop);
  const setting = useStore($twitter);

  $common.listen((setting) => {
    setCensored(setting.censored);
  });
  $twitter.listen((setting) => {
    setAutoPlay(setting.autoPlay);
    setLoop(setting.loop);
  });

  useEffect(() => {
    provider.resolveVideo(detail.video).then((res) => {
      console.log(res);
      setUrl(res);
    });
  }, []);

  return (
    <>
      <Modal.Default maxWidth={1200} close={close}>
        <Wrapper>
          {url ? (
            <Video
              controls
              autoFocus
              loop={loop}
              autoPlay={autoPlay}
              muted={setting.mute}
            >
              <source
                src={censored ? "https://youtu.be/0bIRwBpBcZQ" : url}
                type="video/mp4"
              />
            </Video>
          ) : (
            <Video></Video>
          )}
          <TopRow>
            <ExternalLink href={detail.original} target="_blank">
              <Title>{detail.title ?? "No Title"}</Title>
            </ExternalLink>
            <Menu>
              <Favorite provider={provider} detail={detail} />
            </Menu>
          </TopRow>
          <ExternalLink href={`/twitter/user?user=${detail.user_id}`}>
            <User>@{detail.user}</User>
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
  flex-wrap: wrap;
  flex-direction: column;
  gap: 10px;
`;

const Video = styled.video`
  flex: 1;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  width: inherit;
  height: inherit;
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

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: white;
`;

const User = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: white;
  white-space: pre-wrap;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const ExternalLink = styled.a``;
