import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Compozition from './components/Compozition'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import MembershipFunction from './components/MembershipFunction'
import Home from './components/Home'
import Graphs from './components/Graphs'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar
        content={
          <Routes>
            <Route path="" element={<Home/>}/>
            <Route path="/graphs" element={<Graphs/>}/>
            <Route path="/compozition" element={<Compozition/>}/>
            <Route path="/auth" element={<Auth/>}/>
            <Route path="/member" element={<MembershipFunction/>}/>
          </Routes>
        }
      />
    </>
  )
}

export default App
