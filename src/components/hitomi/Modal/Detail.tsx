import { styled } from "styled-components";
import { useState } from "react";
import Modal from "../../Modal";
import Favorite from "../Content/Favorite";
import { $setting as $common } from "../../../store/setting";
import type { IDetail } from "../../../libs/api/hitomi";
import Loading from "../../../assets/loading.jpg";
import { Hitomi } from "../../../libs/api";

type Props = {
  close: () => void;
  id: string;
  detail: IDetail;
};

export default function Detail({ close, id, detail }: Props) {
  const [censored, setCensored] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);

  $common.listen((setting) => {
    setCensored(setting.censored);
  });

  return (
    <>
      <Modal.Default maxWidth={1200} close={close}>
        <Wrapper>
          {censored ? (
            <Image src={Loading.src} alt={"article"} />
          ) : detail?.files[0]?.hash ? (
            <>
              <Gradient style={{ display: loading ? "block" : "none" }} />
              <Image
                src={Hitomi.getImageURL(detail?.files[0]?.hash, "thumbnail")}
                alt={"article"}
                onLoad={() => setLoading(false)}
                style={{ display: loading ? "none" : "block" }}
              />
            </>
          ) : (
            <Gradient />
          )}
          {/* <Video controls autoFocus loop={loop} autoPlay={autoPlay}>
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
          </Video> */}
          <TopRow>
            <User>
              <a href={`/hitomi/user?user=${detail.artists}`}>
                {detail.artists.toString()}
              </a>
            </User>
            <Menu>
              <Favorite videoId={id} />
            </Menu>
          </TopRow>
          <ExternalLink href={detail.galleryurl} target="_blank">
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

const Image = styled.img`
  width: 100%;
  /* height: 100%;
  max-height: 50vh; */
  height: 50vh;
  object-fit: contain;
`;

const Gradient = styled.div`
  width: 100%;
  /* height: 100%;
  max-height: 50vh; */
  height: 50vh;
  background: linear-gradient(transparent, #000);
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
