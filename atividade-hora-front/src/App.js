import "./App.css";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "./components/appbar";
import { useEffect } from "react";
import Footer from "./components/footer";
import {
  collection,
  getFirestore,
} from "firebase/firestore";
import checkCollection from "./repository";
import { useAuth } from "./components/auth";

function App() {
  const usuariosRef = collection(getFirestore(), "usuarios");

  useEffect(() => {
    checkCollection(usuariosRef);
  });
  const { isLogado } = useAuth();


  return (
    <>
      <div className="App">
        <ResponsiveAppBar />
        <header className="App-header">
          <Outlet isLogado={isLogado} />
          <Footer />
        </header>
      </div>
    </>
  );
}

export default App;
