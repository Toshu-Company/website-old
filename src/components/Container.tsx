import { styled } from "styled-components";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Wrapper>
        <ContainerBox>{children}</ContainerBox>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding-top: 60px;

  display: flex;
  justify-content: center;
`;

const ContainerBox = styled.div`
  width: 1300px;
  height: 100%;

  @media (max-width: 1300px) {
    width: 1036px;
  }

  @media (max-width: 1036px) {
    width: 772px;
  }

  @media (max-width: 772px) {
    width: 85%;
  }
`;
