<<<<<<< HEAD
import {useState, useEffect, useRef} from 'react'
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function Messages({prevSender, setprevSender,socket, ChatMessages, setChatMessages, currentChatUser, setCurrentChatUser, chatList_updateStatus , isTyping, setIsTyping}) {

    const [sendingMessage, setSendingMessage]=useState(false)
    const [currentMessage, setCurrentMessage]=useState("");
    const [profileInfoOpened, setProfileinfoOpened]= useState(false);
    const scrollBottomRef=useRef();

    useEffect(()=>{  // useEffect for getting info of which user is typing
        socket.on('UserTyping', (message)=>{
            setIsTyping({...isTyping, ...message})
        })
        return()=>{
            socket.off('UserTyping')
        }
    },[])

    useEffect(()=>{  // scroll messages to bottom when chat is opened
        const div = scrollBottomRef.current;
        if (div) {
            div.scrollTop = div.scrollHeight+50;
        }
    },[currentChatUser])

    function handleChange(e){ // function to handle change is the message Bar
        setCurrentMessage(e.target.value);
    }
    useEffect(()=>{  // useEffect for typing effect
        if(currentMessage.trim()!==""){
            if(currentChatUser.members){
                socket.emit('typing', currentChatUser, localStorage.getItem('username'));
                var handler=setTimeout(()=>{
                    socket.emit('stoppedTyping', currentChatUser, localStorage.getItem('username'))
                }, 1500)
            }
            else {
                socket.emit('typing', currentChatUser.username, localStorage.getItem('username'))
                var handler=setTimeout(()=>{
                    socket.emit('stoppedTyping', currentChatUser.username, localStorage.getItem('username'))
                }, 1500)
            };
        } 
        var handler=setTimeout(()=>{
            socket.emit('stoppedTyping', currentChatUser.username, localStorage.getItem('username'))
        }, 1500)
        return ()=>{
            clearTimeout(handler);
        }  
    },[currentMessage])

    useEffect(()=>{  // object to store messages to localStorage when chatMessages Changes
        if(Object.keys(ChatMessages).length>0){
            localStorage.setItem('messages', JSON.stringify(ChatMessages))
        } 
        const div = scrollBottomRef.current;
        if (div) {
            div.scrollTo({
                top: div.scrollHeight,
                behavior: 'smooth' // Smooth scrolling
              });
        }
    },[ChatMessages])

    function sendMessage(e){   // function to send  message to the chat partner
        setCurrentMessage(currentMessage.trim())
        if(currentMessage.trim()!=="")
            {
                const date=new Date();
                const time= date.getHours() +":"+ date.getMinutes();
                if(ChatMessages[currentChatUser.username]){
                    if(currentChatUser.members && prevSender!==""){
                        setChatMessages((prev) => ({
                            ...prev,
                            [currentChatUser.username]: [...prev[currentChatUser.username], {sentBy:'senderName', message:prevSender},{sentBy:"me", message:currentMessage.trim(), time:time}]
                        }));
                        setprevSender('')
                    }
                    else{
                        setChatMessages((prev)=>(
                            {
                                ...prev,
                                [currentChatUser.username]:[...prev[currentChatUser.username], {sentBy:"me", message:currentMessage.trim(), time:time}]     
                            })
                        );
                    }
                    
                }
                else{
                    setChatMessages((prev)=>(
                        {
                            ...prev,
                            [currentChatUser.username]:[{sentBy:"me", message:currentMessage.trim(), time:time}]
                        })
                    );
                }
                setSendingMessage(true); 
            }
            e.preventDefault();
    }

    useEffect(()=>{    // useEffect to send a private message to the current user via socket
        if(sendingMessage){
            const date=new Date();
            const time= date.getHours() +":"+ date.getMinutes();
            if (currentChatUser.members){
                socket.emit('groupMessage', {recieverUsers: currentChatUser.members, groupName:currentChatUser.name, username:currentChatUser.username, senderUsername: localStorage.getItem('username'),senderName:localStorage.getItem('name'), message: currentMessage, time:time})
            }
            else{
                socket.emit('privateMessage',  { recieverUsername: currentChatUser.username, senderUsername: localStorage.getItem('username'), message: currentMessage, time:time }); 
            }
            setSendingMessage(false)
            setCurrentMessage("")
            
        }  
    },[sendingMessage])

    function openProfileInfo(e){  // function to open profile
        if(currentChatUser.type==='group'){
        }
        setProfileinfoOpened(true)
    }


  return (
    <div className={`message ${currentChatUser.name?`show`:null}`}>
    <div className='after'>
        <div className={`profileInfo ${profileInfoOpened?'showProfileInfo':null } ${currentChatUser.type==='group'?'showGroupInfo':null}`}>
            <IconButton onClick={()=>{setProfileinfoOpened(false)}} sx={{height:"fit-content", padding:"0px", position:'absolute', top:'10px', left:'10px'}}>
                <ArrowBackIosIcon sx={{color:"white"}}/>
            </IconButton>
            <img className='contact-photo' src={currentChatUser.profilephoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0somSUm3IdLDiKcjOB2elzR8A_JgAxponNQ&s"}/>
                <h1 style={{color:'rgb(223,73,223)', margin:'0'}}>{currentChatUser.name}</h1>
                {currentChatUser.type==="private"?<h3 style={{color:"white", border:'1px solid white', borderRadius:'5px', padding:'0px 10px'}}>{currentChatUser.username}</h3>:null}
                {currentChatUser.type=="group"?<div className='list-of-members'>
                    {currentChatUser.members.map((member)=>(
                        <div className='member'>
                            <Avatar alt="Remy Sharp" src={member.profilephoto} sx={{width:'30px', height:'30px'}}/>
                            <div>
                                <h3 style={{color:'white', fontSize:'16px', margin:'0'}}>{member.name}</h3>
                                <p style={{color:'rgb(100, 100, 100)', fontSize:'12px', margin:'0'}}>{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>:null}
                {currentChatUser.type==="private"?<p style={{color:'rgb(197, 195, 195)'}}>{currentChatUser.bio || "Hey! there I am using Let's Chat"}</p>:null}
        </div>
        {currentChatUser.name?
            <div className="profile-tab" style={{position:'relative'}}>
                <IconButton onClick={()=>{setCurrentChatUser({username:"", name:""}); setCurrentMessage("")}} sx={{height:"fit-content", padding:"0px"}}>
                    <ArrowBackIosIcon sx={{color:"white"}}/>
                </IconButton>
                <Avatar alt="Remy Sharp" onClick={openProfileInfo} src={currentChatUser.profilephoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0somSUm3IdLDiKcjOB2elzR8A_JgAxponNQ&s"} sx={{cursor:'pointer'}} />
                <div className="nameAndStatus" onClick={openProfileInfo} syle={{position:'relative', cursor:'pointer'}}>
                    
                    <h2 style={{cursor:'pointer'}}>{currentChatUser.name}</h2>
                    {chatList_updateStatus[currentChatUser.username] && !isTyping[currentChatUser.username]?<p className='online-status'>online</p>:null}
                    {isTyping[currentChatUser.username]?<p  style={{color:"rgb(223, 73, 223)"}} className='online-status'>typing...</p>:null}
                </div>
            </div>:null}
        {currentChatUser.name?
            <div className="messages" ref={scrollBottomRef}>
                {ChatMessages[currentChatUser.username]?ChatMessages[currentChatUser.username].map(((value, index)=>{
                   return (<div key={index} className={`message-by-${value.sentBy}`}>
                        <div className='text'>
                            <p>{value.message} </p>
                            <div className="timeStamp">{value.time}</div>
                        </div>
                    </div>) 
                })):null}
           </div>:null}
        {currentChatUser.name?<form onSubmit={sendMessage}  className="messaging-tab">
            <input type="text" value={currentMessage} onChange={(e)=>{handleChange(e)}} name="message" placeholder='Type a Message....'/>
            <IconButton type="submit" onClick={sendMessage} sx={{height:"fit-content", padding:"0px"}}>
                <SendIcon sx={{color:"white"}}/>
            </IconButton>
        </form>:null}
    </div> 
</div>
  )
}

=======
import React, {useState, useEffect, useRef} from 'react'
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function Messages({prevSender, setprevSender,socket, ChatMessages, setChatMessages, currentChatUser, setCurrentChatUser, chatList_updateStatus , isTyping, setIsTyping}) {

    const [sendingMessage, setSendingMessage]=useState(false)
    const [currentMessage, setCurrentMessage]=useState("");
    const [profileInfoOpened, setProfileinfoOpened]= useState(false);
    const scrollBottomRef=useRef();

    useEffect(()=>{  // useEffect for getting info of which user is typing
        socket.on('UserTyping', (message)=>{
            setIsTyping({...isTyping, ...message})
        })
        return()=>{
            socket.off('UserTyping')
        }
    },[])
    useEffect(()=>{  // scroll messages to bottom when chat is opened
        const div = scrollBottomRef.current;
        if (div) {
            div.scrollTop = div.scrollHeight+50;
        }
    },[currentChatUser])

    function handleChange(e){ // function to handle change is the message Bar
        setCurrentMessage(e.target.value);
    }
    useEffect(()=>{  // useEffect for typing effect
        let handler;
        if(currentMessage.trim()!==""){
            if(currentChatUser.members){
                socket.emit('typing', currentChatUser, localStorage.getItem('username'));
            }
            else {
                socket.emit('typing', currentChatUser.username, localStorage.getItem('username'))
            };
        } 
        handler=setTimeout(()=>{ // if stopped typing emit stopped typing apter 1.5s
            socket.emit('stoppedTyping', currentChatUser.username, localStorage.getItem('username'))
        }, 1500)
        return ()=>{
            clearTimeout(handler); // cleaar the timeout if useEffect is called befire timeOut is executed
        }  
    },[currentMessage])

    useEffect(()=>{  // object to store messages to localStorage when chatMessages Changes
        if(Object.keys(ChatMessages).length>0){
            localStorage.setItem('messages', JSON.stringify(ChatMessages))
        } 
        const div = scrollBottomRef.current;
        if (div) {
            div.scrollTo({
                top: div.scrollHeight,
                behavior: 'smooth' // Smooth scrolling
              });
        }
    },[ChatMessages])

    function sendMessage(e){   // function to send  message to the chat partner
        setCurrentMessage(currentMessage.trim())
        if(currentMessage.trim()!=="")
            {
                const date=new Date();
                const time= date.getHours() +":"+ date.getMinutes();
                if(ChatMessages[currentChatUser.username]){
                    if(currentChatUser.members && prevSender!==""){
                        setChatMessages((prev) => ({
                            ...prev,
                            [currentChatUser.username]: [...prev[currentChatUser.username], {sentBy:'senderName', message:prevSender},{sentBy:"me", message:currentMessage.trim(), time:time}]
                        }));
                        setprevSender('')
                    }
                    else{
                        setChatMessages((prev)=>(
                            {
                                ...prev,
                                [currentChatUser.username]:[...prev[currentChatUser.username], {sentBy:"me", message:currentMessage.trim(), time:time}]     
                            })
                        );
                    }
                    
                }
                else{
                    setChatMessages((prev)=>(
                        {
                            ...prev,
                            [currentChatUser.username]:[{sentBy:"me", message:currentMessage.trim(), time:time}]
                        })
                    );
                }
                setSendingMessage(true); 
            }
            e.preventDefault();
    }
    useEffect(()=>{    // useEffect to send a private message to the current user via socket
        if(sendingMessage){
            const date=new Date();
            const time= date.getHours() +":"+ date.getMinutes();
            if (currentChatUser.members){
                socket.emit('groupMessage', {recieverUsers: currentChatUser.members, groupName:currentChatUser.name, username:currentChatUser.username, senderUsername: localStorage.getItem('username'),senderName:localStorage.getItem('name'), message: currentMessage, time:time})
            }
            else{
                socket.emit('privateMessage',  { recieverUsername: currentChatUser.username, senderUsername: localStorage.getItem('username'), message: currentMessage, time:time }); 
            }
            setSendingMessage(false)
            setCurrentMessage("")
            
        }  
    },[sendingMessage])

    function openProfileInfo(e){  // function to open profile
        if(currentChatUser.type==='group'){
        }
        setProfileinfoOpened(true)
    }


  return (
    <div className={`message ${currentChatUser.name?`show`:null}`}>
    <div className='after'>
        <div className={`profileInfo ${profileInfoOpened?'showProfileInfo':null } ${currentChatUser.type==='group'?'showGroupInfo':null}`}>
            <IconButton onClick={()=>{setProfileinfoOpened(false)}} sx={{height:"fit-content", padding:"0px", position:'absolute', top:'10px', left:'10px'}}>
                <ArrowBackIosIcon sx={{color:"white"}}/>
            </IconButton>
            <img className='contact-photo' src={currentChatUser.profilephoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0somSUm3IdLDiKcjOB2elzR8A_JgAxponNQ&s"}/>
                <h1 style={{color:'rgb(223,73,223)', margin:'0'}}>{currentChatUser.name}</h1>
                {currentChatUser.type==="private"?<h3 style={{color:"white", border:'1px solid white', borderRadius:'5px', padding:'0px 10px'}}>{currentChatUser.username}</h3>:null}
                {currentChatUser.type=="group"?<div className='list-of-members'>
                    {currentChatUser.members.map((member)=>(
                        <div className='member'>
                            <Avatar alt="Remy Sharp" src={member.profilephoto} sx={{width:'30px', height:'30px'}}/>
                            <div>
                                <h3 style={{color:'white', fontSize:'16px', margin:'0'}}>{member.name}</h3>
                                <p style={{color:'rgb(100, 100, 100)', fontSize:'12px', margin:'0'}}>{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>:null}
                {currentChatUser.type==="private"?<p style={{color:'rgb(197, 195, 195)'}}>{currentChatUser.bio || "Hey! there I am using Let's Chat"}</p>:null}
        </div>
        {currentChatUser.name?
            <div className="profile-tab" style={{position:'relative'}}>
                <IconButton onClick={()=>{setCurrentChatUser({username:"", name:""}); setCurrentMessage("")}} sx={{height:"fit-content", padding:"0px"}}>
                    <ArrowBackIosIcon sx={{color:"white"}}/>
                </IconButton>
                
                <Avatar alt="Remy Sharp" onClick={openProfileInfo} src={currentChatUser.profilephoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0somSUm3IdLDiKcjOB2elzR8A_JgAxponNQ&s"} sx={{cursor:'pointer'}} />
                <div className="nameAndStatus" onClick={openProfileInfo} syle={{position:'relative', cursor:'pointer'}}>
                    
                    <h2 style={{cursor:'pointer'}}>{currentChatUser.name}</h2>
                    {currentChatUser.isOnline && !isTyping[currentChatUser.username]?<p className='online-status'>online</p>:null}
                    {isTyping[currentChatUser.username]?<p  style={{color:"rgb(223, 73, 223)"}} className='online-status'>typing...</p>:null}
                </div>
                
            </div>:null}
        {currentChatUser.name?
            <div className="messages" ref={scrollBottomRef}>
                {ChatMessages[currentChatUser.username]?ChatMessages[currentChatUser.username].map(((value, index)=>{
                   return (<div key={index} className={`message-by-${value.sentBy}`}>
                        <div className='text'>
                            <p>{value.message} </p>
                            <div className="timeStamp">{value.time}</div>
                        </div>
                    </div>) 
                })):null}
           </div>:null}
        {currentChatUser.name?<form onSubmit={sendMessage}  className="messaging-tab">
            <input type="text" value={currentMessage} onChange={(e)=>{handleChange(e)}} name="message" placeholder='Type a Message....'/>
            <IconButton type="submit" onClick={sendMessage} sx={{height:"fit-content", padding:"0px"}}>
                <SendIcon sx={{color:"white"}}/>
            </IconButton>
        </form>:null}
    </div> 
</div>
  )
}
>>>>>>> 8dc72b2168d9bb1c0b390dca4abf44bc1b1356cd
export default Messages