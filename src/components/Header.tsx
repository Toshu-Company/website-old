import { useState } from "react";
import styled from "styled-components";

import Image from "./Image";

import { updateParams } from "../libs/params";
import TwitterIcon from "../assets/twitter.svg";
import SearchIcon from "../assets/search.svg";
import SettingIcon from "../assets/setting.svg";
import HeartIcon from "../assets/heart.svg";
import Settings from "./Settings";

export default function Header() {
  const [modal, setModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  return (
    <>
      <Wrapper>
        <Container>
          <a href={"/"}>
            <Image
              src={TwitterIcon.src}
              width={[40, { responsive: 768, size: 32 }]}
              alt="Twitter"
              responsive
            />
          </a>
          <Row>
            <Search>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
              />
              <Button onClick={() => updateParams({ search })}>
                <Image
                  src={SearchIcon.src}
                  width={[20, { responsive: 768, size: 16 }]}
                  alt="Search"
                  responsive
                />
              </Button>
            </Search>
            <Button onClick={() => setModal(true)}>
              <Image
                src={SettingIcon.src}
                width={[24, { responsive: 768, size: 20 }]}
                alt="Setting"
                responsive
              />
            </Button>
            <LinkButton href={"/favorites"}>
              <Image
                src={HeartIcon.src}
                width={[24, { responsive: 768, size: 20 }]}
                alt="Favorites"
                responsive
              />
            </LinkButton>
          </Row>
        </Container>
      </Wrapper>
      {modal && <Settings.Default close={() => setModal(false)} />}
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 60px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #1e1e1e;

  position: fixed;
  top: 0;
  left: 0;

  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Container = styled.div`
  max-width: 1300px;
  width: 90%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Search = styled.div`
  width: 200px;
  height: 40px;
  border-radius: 8px;
  padding: 0 10px;
  gap: 10px;

  display: flex;
  align-items: center;

  background-color: #202327;
  color: white;

  &::placeholder {
    color: #8899a6;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 30px;

    font-size: 14px;
  }
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  min-width: 0;

  background-color: transparent;
`;

const Button = styled.button`
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    border-bottom: 2px solid #1da1f2;
  }

  &:active {
    transform: translateY(0);
  }
`;

const LinkButton = styled.a`
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    border-bottom: 2px solid #1da1f2;
  }

  &:active {
    transform: translateY(0);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;
