import { useEffect, useState } from 'react'
import { Outlet, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Protected(prop) {
  const [isAunthenticated, setIsAuthenticated]=useState(null)
  const [isLoading, setIsLoading]=useState(false)
  const navigate=useNavigate()
  useEffect(()=>{
    setIsLoading(true)
    if(prop.isLoggedIn){
      axios.post("http://localhost:4000/authenticate-user", {username:localStorage.getItem('username')},  {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // token verification whenever reloads page
      }
    })
      .then((response)=>{
        if(response.data.status==="valid"){
         setIsAuthenticated(true)
         setIsLoading(false)
        }
        else if(response.data.status==='error'){
          localStorage.removeItem('username')
          localStorage.removeItem('token')
          localStorage.removeItem('isLoggedIn')
          setIsLoading(false)
          navigate('/login') // navigate to login page when user credentials are invalid
        }
      })
      .catch((err)=>{
        setIsLoading(false)
        console.log(err)
      })
    }
    setIsLoading(false)
  },[prop.isLoggedIn])
  if(isAunthenticated===null){
    return(
    <div className='enter-page'>
      {isLoading?<Backdrop
      sx={(theme) => ({ color: 'rgb(0,0,0)', zIndex: 100 })} open={true}>
        <CircularProgress sx={{color:"white"}} />
      </Backdrop>:null}
    </div>)
  }
  return isAunthenticated?<Outlet/>:null
  
}

export default Protected
