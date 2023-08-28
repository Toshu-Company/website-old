import { styled } from "styled-components";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Wrapper>{children}</Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  align-items: flex-start;
  align-content: flex-start;
`;
