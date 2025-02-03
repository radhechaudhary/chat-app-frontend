import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {  useNavigate, Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';

function Signup(prop) {

    const navigate=useNavigate();
    const [values, setValues]=useState({name:"", username:"", password:""});
    const [submitted, setSubmmited]=useState(false)
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState(" ")
    const [uploading, setUploading]=useState(false);
    const [uploaded, setUploaded]=useState(false);
    const [profileImage, setProfileImage]=useState(null);
    const [image, setImage]=useState(null);

    function handleChange(e){
        const name=e.target.name;
        const value=e.target.value;
        if(!(name==="name" && value.length>15) || !(name==='username' || value.length>15 )){
          setValues(
            {
                ...values,
                [name]:value
            }
          )
        }   
    }

    function handleImageChange(e){
      // alert('images uploaded')
        const file=e.target.files[0];
        if (file) {
          setImage(file)
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfileImage(reader.result); // Set the image data to the state
          };
          reader.readAsDataURL(file); // Read the file as a data URL
        }
    }

    function submit(e){
        setSubmmited(true)
          e.preventDefault();
      }
    function uploadImage(e){
      setUploaded(true);
      e.preventDefault();
    }


      useEffect(()=>{
        if(values.username!=="" && submitted){
          setSubmmited(false)
          setLoading(true)
          axios.post("https://chat-app-backend-production-bd09.up.railway.app:8058/signup", {name:values.name, username:values.username, password:values.password})
          .then((response)=>{
            if(response.data.status==="valid" || response.data.status==="no file"){
              prop.setcurrUser(response.data.username);
              localStorage.setItem("username", response.data.username);
              localStorage.setItem('isLoggedIn', true)
              localStorage.setItem("token",response.data.token);
              localStorage.setItem('name', values.name);
              setLoading(false)
              setUploading(true)
              setError("")
              // navigate('/', {replace:true})
            }
            else{
                setError(response.data)
                setLoading(false);
              }
        })
        .catch((err)=>{
            setLoading(false)
            console.log(err.message)
        })
    }
        
      }, [submitted])

    useEffect(()=>{
      if(uploading){
        setUploading(false);
        setLoading(true);
        const formData = new FormData();
        formData.append('file', image); // 'file' is the field name expected by the server
        formData.append('username', values.username);
        formData.append('token', localStorage.getItem('token'));
        axios.post("https://chat-app-backend-production-bd09.up.railway.app:8058/upload-profile-photo", formData)
        .then((response)=>{
          if(response.data.status==='valid'){
            prop.setLoggedIn(true);
            setLoading(false)
            localStorage.setItem('profile-photo', `${response.data.photo_url}?t=${new Date().getTime()}`);
            navigate('/', {replace:true})
          }
        })
        .catch((err)=>{
          console.log(err.message);
        })
        prop.setLoggedIn(true);
      }
      
    },[uploaded])


  return (
    <div className="login signup enter-page">
      {loading?<Backdrop
      sx={(theme) => ({ color: 'rgb(0,0,0)', zIndex: 100 })} open={true}>
        <CircularProgress sx={{color:"white"}} />
      </Backdrop>:null}
      {!uploading?<form onSubmit={submit} className="detail-form">
        <h1>SIGNUP!</h1>
        <input type="text" name="name" onChange={(e)=>{handleChange(e)}} value={values.name} placeholder='name'/>
        <input type="text" name="username" onChange={(e)=>{handleChange(e)}} value={values.username} placeholder='Username'/>
        <input type="password" name="password" onChange={(e)=>{handleChange(e)}} value={values.password} placeholder='Password'/>
        <p className='error'>{error}</p>
        <p>Already have an Account? <Link to="/login">Login</Link></p>
        <button type='submit'>Create  →</button>
      </form>:null}
      {uploading?
      <form onSubmit={uploadImage} className="detail-form" style={{position:'relative',alignItems:'center'}}>
        <h1>Choose a photo</h1>
        <img src={profileImage || 'data:image/jpeg;base64,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'} 
        className='profile-image-preview' style={{width:'70%', height:'auto', aspectRatio:'1/1', borderRadius:'50%'}}/>
        <input type='file' accept="image/*" onChange={handleImageChange}  id='profile-upload' name='profilePic' style={{display:'none'}}/>
        <label htmlFor='profile-upload' style={{position:'relative', cursor:'pointer', bottom:'20px', left:'30px'}} className='upload'><LinkedCameraIcon sx={{color:'white'}}/></label>
        <button type='submit' style={{left:'0%', transform:'translate(0, 0)'}}>Create  →</button>
      </form>
      :null}
      
    </div>
  )
}

export default Signup
