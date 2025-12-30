
import './index.css'; // or App.css if you want

import './App.css'
import HeaderNav from './components/Header';
import { Route, Routes } from 'react-router-dom';
import UnderConstruction from './components/UnderConstruction';
import Landing from './pages/Landing';
import Verify from './pages/Verify';
import VerifyOTP from './pages/VerifyOTP';
import LastSetup from './pages/LastSetup';
import SendEmail from './pages/SendEmail';
import SendSummary from './pages/SendSummary';


function App() {

  return (
    <div className="">
      <HeaderNav onLogout={() => alert("logout")}/>
      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/guide" element={<UnderConstruction />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/otp" element={<VerifyOTP />} />
        <Route path="/verify/otp/app-password" element={<LastSetup />} />
        <Route path="/send-email" element={<SendEmail />} />
        <Route path="/send-email/summary" element={<SendSummary />} />

        {/* 404 page */}
        <Route path="*" element={<UnderConstruction />} />
      </Routes>
    </div>
  )
}

export default App
