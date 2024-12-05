import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import Homepage2 from './components/Homepage2'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar
        content={
          <Routes>
            <Route path="" element={<Homepage/>}/>
            <Route path="/home2" element={<Homepage2/>}/>
            <Route path="/auth" element={<Auth/>}/>
          </Routes>
        }
      />
    </>
  )
}

export default App
