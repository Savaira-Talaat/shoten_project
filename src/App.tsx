import { Routes, Route } from "react-router-dom";
import Accueil from './pages/Home';
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
            <Route path="/" element={<Accueil />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="advanced-search" element={<AdvancedSearch/>} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;