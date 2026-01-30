import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './assets/Home';
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
            <Route path="/book/:id" element={<BookDetail />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;