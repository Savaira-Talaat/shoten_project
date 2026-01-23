import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './assets/Home';
import Navbar from './components/Navbar';

function App() {

  return (
    <>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;