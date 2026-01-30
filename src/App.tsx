import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Search from './pages/Search';
import AdvancedSearch from './pages/AdvancedSearch';
import Navbar from './components/Navbar';
import BookDetail from './pages/BookDetail';

function App() {

  return (
    <>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
<<<<<<< HEAD
            <Route path="/book/:id" element={<BookDetail />} />
=======
            <Route path="/search" element={<Search />} />
            <Route path="advanced-search" element={<AdvancedSearch/>} />
>>>>>>> 396a21b510474889de48c7ffabb5f805b65c0e5e
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;