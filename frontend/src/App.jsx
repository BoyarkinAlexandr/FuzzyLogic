import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Compozition from './components/Compozition';
import Navbar from './components/Navbar';
import MembershipFunction from './components/MembershipFunction';
import Home from './components/Home';
import Graphs from './components/Graphs';
import RegisterPage from './components/RegisterPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import ActivatePage from './components/ActivatePage';
import LoginPage from './components/LoginPage';
import NotFoundPage from './components/NotFoundPage';
import Asection from './components/ASection';



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
            <Route path="/member" element={<MembershipFunction />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/account-activate" element={<ActivatePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/asection" element={<Asection />} />
          </Routes>
        }
        onSearch={handleSearch} // Передаем функцию для обновления searchQuery
      />
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
