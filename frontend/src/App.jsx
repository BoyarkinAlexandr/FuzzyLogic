import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Compozition from './components/Compozition';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import MembershipFunction from './components/MembershipFunction';
import Home from './components/Home';
import Graphs from './components/Graphs';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // Функция для обновления searchQuery
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Navbar 
        content={
          <Routes>
            <Route path="" element={<Home searchQuery={searchQuery} />} />
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/compozition" element={<Compozition />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/member" element={<MembershipFunction />} />
          </Routes>
        }
        onSearch={handleSearch} // Передаем функцию для обновления searchQuery
      />
    </>
  );
}

export default App;