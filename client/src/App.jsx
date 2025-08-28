import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from './pages/Chat';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';

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
    </>
  )
}
export default App;
