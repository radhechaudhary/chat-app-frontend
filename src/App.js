import React, { useEffect, useState } from "react";
import Login from "./components/login";
import Protected from "./protected";
import {  Routes, Route,  useNavigate, replace } from 'react-router-dom';
import Chat from "./components/chat";
import Home from "./components/home";
import Signup from "./components/signup";


function App() {
  const [currUser, setcurrUser]=useState(localStorage.getItem('username'))
  const [isLoggedIn, setLoggedIn]=useState(false)
  const navigate=useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('username') && localStorage.getItem('isLoggedIn') && localStorage.getItem('token')){
      setcurrUser(localStorage.getItem('username'))
      setLoggedIn(true)
      navigate('/', {replace:true})
    }
    else{
      navigate('/login', {replace:true})
    }
  },[])
  
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login setcurrUser={setcurrUser} setLoggedIn={setLoggedIn}/>}/>
        <Route path='/signup' element={<Signup setcurrUser={setcurrUser} setLoggedIn={setLoggedIn}/>}/>
        <Route element={<Protected isLoggedIn={isLoggedIn}/>}>
            <Route path='/' element={<Chat/>}/> 
        </Route>
        <Route path='/home' element={<Home />}/>
      </Routes>
      
    </div>
  );
}

export default App;
