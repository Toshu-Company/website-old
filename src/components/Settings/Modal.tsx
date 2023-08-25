import { styled } from "styled-components";
import Modal from "../Modal";
import Toggle from "./Toggle";

type Props = {
  close: () => void;
};

export default function Default({ close }: Props) {
  return (
    <>
      <Modal.Default close={close}>
        <Wrapper>
          <Category>Category 1</Category>
          <Toggle label="Toggle" />
          <Splitter />
          <Category>Category 2</Category>
          <Toggle label="Toggle" />
        </Wrapper>
      </Modal.Default>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Splitter = styled.div`
  width: 100%;
  height: 1px;
  background-color: #696969;
  margin: 16px 0;
`;

const Category = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 16px;
`;
