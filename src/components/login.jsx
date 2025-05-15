<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Login(prop) {
  const navigate=useNavigate()
    const [values, setValues]=useState({username:"", password:""});
    const [submitted, setSubmmited]=useState(false)
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState("")

    function handleChange(e){
        const name=e.target.name;
        const value=e.target.value;
        setValues(
            {
                ...values,
                [name]:value
            }
        )
    }

    function submit(e){
      setSubmmited(true)
      
        e.preventDefault();
    }

    useEffect(()=>{
      if(values.username!=="" && submitted){
        setSubmmited(false)
        setLoading(true)
      axios.post("http://localhost:4000/login", {username:values.username, password:values.password})
      .then((response)=>{
        if(response.data.status==="valid"){
          prop.setcurrUser(response.data.username);
          prop.setLoggedIn(true);
          localStorage.setItem("username", response.data.username);
          localStorage.setItem('isLoggedIn', true)
          localStorage.setItem("token",response.data.token);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem('profile-photo', `${response.data.profilephoto}?t=${new Date().getTime()}`);
          setLoading(false)
          setError("")
          navigate('/', {replace:true})
        }
        else{
          setLoading(false)
          setError(response.data)
        }
        
      })
      .catch((err)=>{
        setLoading(false)
        console.log(err.message)
      })
      }
      
      
    }, [submitted])
  return (
    <div className="login enter-page">
      {loading?<Backdrop
      sx={(theme) => ({ color: 'rgb(0,0,0)', zIndex: 100 })} open={true}>
        <CircularProgress sx={{color:"white"}} />
      </Backdrop>:null}
      <form onSubmit={submit} className="detail-form">
        <h1>LOGIN!</h1>
        <input type="text" name="username" onChange={(e)=>{handleChange(e)}} value={values.username} placeholder='Username'/>
        <input type="password" name="password" onChange={(e)=>{handleChange(e)}} value={values.password} placeholder='Password'/>
        {error?<p className='error'>{error}</p>:<p className='error'>{error}</p>}
        <p>Dont't have an account? <Link to="/signup">Regester Here!</Link></p>
        <button type='submit'>Login  →</button>
      </form>
    </div>
  )
}

export default Login
=======
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Login(prop) {
  const navigate = useNavigate()
    const [values, setValues]=useState({username:"", password:""});
    const [submitted, setSubmmited]=useState(false)
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState("")

    function handleChange(e){
        const name=e.target.name;
        const value=e.target.value;
        setValues(
            {
                ...values,
                [name]:value
            }
        )
    }

    function submit(e){
      setSubmmited(true)
      
        e.preventDefault();
    }

    useEffect(()=>{
      if(values.username!=="" && submitted){
        setSubmmited(false)
        setLoading(true)
      axios.post("https://chat-app-backend-production-bd09.up.railway.app/login", {username:values.username, password:values.password})
      .then((response)=>{
        if(response.data.status==="valid"){
          prop.setLoggedIn(true);
          localStorage.setItem("username", response.data.username);
          localStorage.setItem('isLoggedIn', true)
          localStorage.setItem("token",response.data.token);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem('profile-photo', `${response.data.profilephoto}?t=${new Date().getTime()}`);
          setLoading(false)
          setError("")
          navigate('/', {replace:true})
        }
        else{
          setLoading(false)
          setError(response.data)
        }
        
      })
      .catch((err)=>{
        setLoading(false)
        console.log(err.message)
      })
      } 
    }, [submitted])
  return (
    <div className="login enter-page">
      {loading?<Backdrop
      sx={(theme) => ({ color: 'rgb(0,0,0)', zIndex: 100 })} open={true}>
        <CircularProgress sx={{color:"white"}} />
      </Backdrop>:null}
      <form onSubmit={submit} className="detail-form">
        <h1>LOGIN!</h1>
        <input type="text" name="username" onChange={(e)=>{handleChange(e)}} value={values.username} placeholder='Username'/>
        <input type="password" name="password" onChange={(e)=>{handleChange(e)}} value={values.password} placeholder='Password'/>
        {error?<p className='error'>{error}</p>:<p className='error'>{error}</p>}
        <p>Dont't have an account? <Link to="/signup">Register Here!</Link></p>
        <button type='submit'>Login  →</button>
      </form>
    </div>
  )
}

export default Login
>>>>>>> 8dc72b2168d9bb1c0b390dca4abf44bc1b1356cd
