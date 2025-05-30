import { useEffect, useState } from "react";
import Login from "./components/login";
import Protected from "./protected";
import {  Routes, Route,  useNavigate } from 'react-router-dom';
import Chat from "./components/chat";
import Signup from "./components/signup";


function App() {
  const [isLoggedIn, setLoggedIn]=useState(false)
  const navigate=useNavigate();

  useEffect(()=>{  // every time user reloads page to check if he is already logged in or not
    if(localStorage.getItem('username') && localStorage.getItem('isLoggedIn') && localStorage.getItem('token')){
      setLoggedIn(true)
      navigate('/', {replace:true}) // if already logged in navigate to home
    }
    else{
      navigate('/login', {replace:true}) // else navigate to login page
    }
  },[])
  
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login  setLoggedIn={setLoggedIn}/>}/>
        <Route path='/signup' element={<Signup  setLoggedIn={setLoggedIn}/>}/>
        <Route element={<Protected isLoggedIn={isLoggedIn}/>}>
            {/* protected route */}
            <Route path='/' element={<Chat/>}/>
        </Route>
      </Routes>
      
    </div>
  );
}

export default App;
