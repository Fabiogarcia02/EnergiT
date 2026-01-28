import React from "react";
import Login from "./pages/Login/Login";
import Signup from "./pages/Cadastro/Singup";
import Homepage from "./pages/Home";
import Header from "./pages/Header";
import Footer from "./pages/Footer";

const App = () => {
  return (
    <div className="App">
      {/* <Login /> */}
      <Header />
      <Homepage />
      <Footer />
  
    </div>
  );
};

export default App;
