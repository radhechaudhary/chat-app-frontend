import { useEffect, useState } from "react";
import Login from "./components/login";
import Protected from "./protected";
import {  Routes, Route,  useNavigate } from 'react-router-dom';
import Chat from "./components/chat";
import Home from "./components/home";
import Signup from "./components/signup";


function App() {
  const [isLoggedIn, setLoggedIn]=useState(false)
  const navigate=useNavigate();

<<<<<<< HEAD
  useEffect(()=>{  // every time user reloads page to check if he is already logged in or not
=======
  useEffect(()=>{  // run every time component mounts
>>>>>>> 8dc72b2168d9bb1c0b390dca4abf44bc1b1356cd
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
        <Route path='/home' element={<Home />}/>
<<<<<<< HEAD
      </Routes>
      
=======
      </Routes> 
>>>>>>> 8dc72b2168d9bb1c0b390dca4abf44bc1b1356cd
    </div>
  );
}

export default App;
