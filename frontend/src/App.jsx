import styled from "styled-components";
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
  padding: 1rem 2rem;
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

function App() {
  return (
    <Layout>
      <Main>
        <Header>
          <HeaderTitle>Hap</HeaderTitle>
        </Header>
        <Playground />
        <Footer>Made by MiniPear with Charming.js</Footer>
      </Main>
    </Layout>
  );
}

export default App;
