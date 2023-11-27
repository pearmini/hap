import bear from "./assets/bear.png";
import "./App.css";

function App() {
  return (
    <main className="main">
      <section className="playground">
        <header className="header">
          <h2 className="header-title">Hap</h2>
        </header>
        <div className="content">
          <img src={bear} width={300} />
        </div>
        <footer className="footer">Made by MiniPear</footer>
      </section>
      <aside className="aside">
        <span>Editor</span>
      </aside>
    </main>
  );
}

export default App;
