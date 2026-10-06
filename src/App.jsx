import { Routes, Route } from 'react-router'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'

function App() {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
