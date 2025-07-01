import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import UserSignUp from './pages/UserSignUp';
import CaptainLogin from './pages/CaptainLogin';
import CaptainSignUp from './pages/CaptainSignUp';
import Start from './pages/start';
import UserProtectWrapper from './pages/UserProtectedWrapper';
import UserLogout from './pages/UserLogout';
import CaptainProtectWrapper from './pages/CaptainProtectedWrapper';
import CaptainHome from './pages/CaptainHome';

const App = () => {
  return (
    <div>
      <Routes>
        <Route  path="/" element={<Start/>} />
        <Route  path="/login" element={<UserLogin/>} />
        <Route  path="/signup" element={<UserSignUp/>} />
        <Route  path="/captain-login" element={<CaptainLogin/>} />
        <Route  path="/captain-signup" element={<CaptainSignUp/>} />
        <Route  path="/home" element={
          <UserProtectWrapper>
            <Home/>
            </UserProtectWrapper>} /> 
        <Route path='user/logout' element={<UserProtectWrapper><UserLogout/></UserProtectWrapper>} />

        <Route  path="/captain-home" element={
         <CaptainProtectWrapper>
          <CaptainHome/>
         </CaptainProtectWrapper>} />
        <Route path='captain/logout' element={<CaptainProtectWrapper><UserLogout/></CaptainProtectWrapper>} />  

        
        




      </Routes>
      
    </div>

  );
} 

export default App;