import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {  useNavigate, Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Signup(prop) {

    const navigate=useNavigate();
    const [values, setValues]=useState({name:"", username:"", password:""});
    const [submitted, setSubmmited]=useState(false)
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState(" ")

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
          axios.post("http://localhost:4000/signup", {name:values.name, username:values.username, password:values.password})
          .then((response)=>{
            console.log(response.data)
            if(response.data.status==="valid"){
                prop.setcurrUser(response.data.username);
                prop.setLoggedIn(true);
                localStorage.setItem("username", response.data.username);
                localStorage.setItem('isLoggedIn', true)
                localStorage.setItem("token",response.data.token);
                setLoading(false)
                setError("")
                navigate('/', {replace:true})
            }
            else{
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
    <div className="login signup enter-page">
      {loading?<Backdrop
      sx={(theme) => ({ color: 'rgb(0,0,0)', zIndex: 100 })} open={true}>
        <CircularProgress sx={{color:"white"}} />
      </Backdrop>:null}
      <form onSubmit={submit} className="detail-form">
        <h1>SIGNUP!</h1>
        <input type="text" name="name" onChange={(e)=>{handleChange(e)}} value={values.name} placeholder='name'/>
        <input type="text" name="username" onChange={(e)=>{handleChange(e)}} value={values.username} placeholder='Username'/>
        <input type="password" name="password" onChange={(e)=>{handleChange(e)}} value={values.password} placeholder='Password'/>
        <p className='error'>{error}</p>
        <p>Already have an Account? <Link to="/login">Login</Link></p>
        <button type='submit'>Login  →</button>
      </form>
    </div>
  )
}

export default Signup
