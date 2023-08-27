import { keyframes, styled } from "styled-components";
import Image from "../Image";
import Loading from "../../assets/loading.jpg";

export default function Skeleton() {
  return (
    <>
      <Wrapper>
        <ImageWrapper>
          {/* <RoundedImage src={Loading.src} fill alt={"article"} /> */}
          <Gradient />
        </ImageWrapper>
        <TextWrapper>
          <Text>Loading...</Text>
        </TextWrapper>
      </Wrapper>
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

const Gradient = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent, #000);
`;
