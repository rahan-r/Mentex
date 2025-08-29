import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from './pages/Chat';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Chat/>} />
          <Route path='/auth' element={<Auth/>}/>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </>
  )
}
export default App;
