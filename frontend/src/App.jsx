import styled from "styled-components";
import { GithubOutlined } from "@ant-design/icons";
import { Playground } from "./components/Playground";

const Layout = styled.main`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Main = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

const Header = styled.header`
  background: black;
  height: 6rem;
  padding: 0rem 2rem;
  line-height: 6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  color: white;
`;

const Footer = styled.footer`
  background: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  padding: 0.8rem 0;
`;

const CharmingLink = styled.a`
  color: #3875f6;
`;

const GithubLink = styled.a`
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
`;

function App() {
  return (
    <Layout>
      <Main>
        <Header>
          <HeaderTitle>HAP</HeaderTitle>
          <GithubLink href="https://github.com/pearmini/hap" target="_blank" rel="noreferrer">
            <GithubOutlined />
          </GithubLink>
        </Header>
        <Playground />
        <Footer>
          Made by MiniPear with&nbsp;
          <CharmingLink href="https://github.com/charming-art/charming" target="_blank" rel="noreferrer">
            Charming.js
          </CharmingLink>
        </Footer>
      </Main>
    </Layout>
  );
}

export default App;
