import bear from "./assets/bear.png";
import styled from "styled-components";

const Main = styled.main`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Playground = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: calc(100% - 20rem);
`;

const Header = styled.header`
  background: black;
  height: 6rem;
  padding: 1rem 2rem;
`;

const HeaderTitle = styled.h2`
  color: white;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

const Sider = styled.aside`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  z-index: 200;
  width: 20rem;
  background-color: #111;
  padding: 1.8rem 1rem;
`;

function App() {
  return (
    <Main>
      <Playground>
        <Header>
          <HeaderTitle>Hap</HeaderTitle>
        </Header>
        <Content>
          <img src={bear} width={300} />
        </Content>
        <Footer>Made by MiniPear</Footer>
      </Playground>
      <Sider>
        <span>Editor</span>
      </Sider>
    </Main>
  );
}

export default App;
