
import './index.css'; // or App.css if you want

import './App.css'
import HeaderNav from './components/Header';
import { Route, Routes } from 'react-router-dom';
import UnderConstruction from './components/UnderConstruction';


function App() {

  return (
    <div className="bg-dark">
      <HeaderNav onLogout={() => alert("logout")}/>
      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<UnderConstruction />} />
        <Route path="/about" element={<UnderConstruction />} />

        {/* 404 page */}
        <Route path="*" element={<UnderConstruction />} />
      </Routes>
    </div>
  )
}

export default App
