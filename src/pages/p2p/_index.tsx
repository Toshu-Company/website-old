import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../libs/observer";
import { Hitomi } from "../../libs/api";
import Content from "../../components/hitomi/Content";

export default function Index() {


    return (
        <>
            <Wrapper>
                <Container>
                    <Header>
                        <Title>히토미</Title>
                        <SubTitle>히토미는 무엇인가요?</SubTitle>
                    </Header>
                    <Body>
                        <Text>
                            히토미는 성인만화를 제공하는 웹사이트입니다. 히토미는 다양한 작품들을 제공하며, 사용자들은 이를 무료로 감상할 수 있습니다.
                        </Text>
                    </Body>
                </Container>
            </Wrapper>
        </>
    );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  padding-top: 20px;
  margin-bottom: 20px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 20px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const Title = styled.h1`
    font-size: 36px;
    font-weight: bold;
`;
const SubTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
`;
const Body = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const Text = styled.p`
    font-size: 18px;
`;

