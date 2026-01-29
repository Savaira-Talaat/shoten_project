import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Search from './pages/Search';
import AdvancedSearch from './pages/AdvancedSearch';
import Navbar from './components/Navbar';

function App() {

  return (
    <>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="advanced-search" element={<AdvancedSearch/>} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;