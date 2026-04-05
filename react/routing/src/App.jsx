import React from "react";
import Nav from "./Nav";
import Home from "./Home";
import About from "./About";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
