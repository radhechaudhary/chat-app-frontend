import React, { useState, useEffect , useRef} from 'react'
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Avatar from '@mui/material/Avatar';
import { io } from 'socket.io-client';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const socket = io('http://localhost:4000');
  
function Chat() {
    
    const navigate=useNavigate();
    const scrollBottomRef=useRef();
    const [chatList, setChatList]=useState([]);
    const [chatList_updateStatus, setChatList_updateStatus]=useState({})
    const [searched, setSearched]=useState([])
    const [sendingMessage, setSendingMessage]=useState(true)
    const [currentChatUser, setCurrentChatUser]=useState({username:"", name:"", online:null});
    const [currentMessage, setCurrentMessage]=useState("");
    const [ChatMessages, setChatMessages]=useState({})
    const [inputValue, setInputValue]=useState("");
    const [addingNewChat, setAddingNewChat]=useState(false)


    socket.emit('register', localStorage.getItem('username'))  // regeter the user socket every time component mounts
    

    useEffect(()=>{  // useEffect which runs when component mounts
        if(localStorage.getItem('chat-list') && chatList.length===0){
            setChatList(JSON.parse(localStorage.getItem('chat-list')));
        }
        socket.emit('update_status', localStorage.getItem('username'), true )
        
    },[])
    useEffect(() => {  // add event listner for esc key!!
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setCurrentChatUser({username:"", name:""})
                // Add your custom logic here
            }
        };

        // Attach the event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {   // rcieve private messsages
        // Define the event listener
        const handlePrivateMessage = ({ username, message }) => {
            const date=new Date();
            const time= date.getHours() +":"+ date.getMinutes();
            
            if (ChatMessages[username]) {
                setChatMessages((prev) => ({
                    ...prev,
                    [username]: [...prev[username], { sentBy: "partner", message, time:time }]
                }));
            } else {
                setChatMessages((prev) => ({
                    ...prev,
                    [username]: [{ sentBy: "partner", message, time:time}]
                }));
            }
    
            if ( chatList.find((user) => user.username === username)) {
                // Update chatList for unread messages
                const updatedChatList = chatList.map((chat) => {
                    if (username === chat.username && username !== currentChatUser.username) {
                        return { ...chat, unread: true };
                    }
                    return chat;
                });
    
                setChatList(updatedChatList);
    
                // Move the user to the top of the list
                setChatList((prevItems) => {
                    const objToMove = prevItems.find((item) => item.username === username);
                    if (!objToMove) return prevItems;
                    return [objToMove, ...prevItems.filter((item) => item.username !== username)];
                });
            }
            else{
                socket.emit('newChat', username)
                socket.on('AddnewChat', (user)=>{  
                    if(user.username){
                        console.log('added')
                        setChatList([{...user, unread:true},...chatList]) 
                        socket.off('AddnewChat')
                    }
                })
            
        }
        };
    
        // Register the listener
        socket.on('privateMessage', handlePrivateMessage);

        socket.on('update_status_list', (list)=>{
            console.log(list)
            setChatList_updateStatus({...chatList_updateStatus, ...list})
        })
    
        // Cleanup listener on component unmount or re-render
        return () => {
            socket.off('update_status_list', )
            socket.off('privateMessage', handlePrivateMessage);
        };
    }, [ChatMessages, chatList, currentChatUser, chatList_updateStatus]);
    

    function handleChange(e){ // function to handle change is the searchbar 
        if(e.target.name==="searchChat")setInputValue(e.target.value); 
        else if(e.target.name==="message")setCurrentMessage(e.target.value);
    }
    useEffect(()=>{   // to add new chat via entering username which triggers when input value changes
        if(addingNewChat && inputValue.trim()!=="" && inputValue.trim().length>=8){
            socket.emit('newChat', inputValue)
            socket.on('AddnewChat', (message)=>{
                if(message.username){
                    if(message.username!==localStorage.getItem('username') && chatList.find((user)=> user.username===message.username )===undefined){
                        socket.off('AddnewChat')
                        setSearched([message])
                    }
                    
                }
                else{
                    socket.off('AddnewChat')
                    setSearched([])
                }
            })
        }
    },[inputValue])

    function startChatting(indx){ // function to change or start the current chat....
        if(addingNewChat){
            setCurrentChatUser({...searched[0]})
            setChatList([{...searched[0], unread:false},...chatList])
            setSearched([])
            setAddingNewChat(false)
            setInputValue("")
        }
        else{
            const updatedChatList = chatList.map((chat, index) => { // function to update unread on opening messages!
                if (indx === index) {
                    // Return the updated object
                    return { ...chat, unread:false };  // Update the message
                }
                return chat;  // Return the original object if no match
            })
            setChatList(updatedChatList)
            setCurrentChatUser({...chatList[indx]})
        }
        setInputValue("")
    }
    useEffect(()=>{  // useStae to save th echat list to local storage when it changes
        if(chatList.length>0) localStorage.setItem('chat-list',JSON.stringify(chatList))
            const div = scrollBottomRef.current;
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    },[chatList])

    function sendMessage(e){   // function to send  message to the chat partner
        
        setCurrentMessage(currentMessage.trim())
        if(currentMessage.trim()!=="")
            {
                const date=new Date();
                const time= date.getHours() +":"+ date.getMinutes();
                if(ChatMessages[currentChatUser.username]){
                    setChatMessages(
                        {
                            [currentChatUser.username]:[...ChatMessages[currentChatUser.username], {sentBy:"me", message:currentMessage, time:time}]
                        }
                    )
                }
                else{
                    setChatMessages(
                        {
                            [currentChatUser.username]:[{sentBy:"me", message:currentMessage, time:time}]
                        }
                    )
                }
                setSendingMessage(true);
            }
            e.preventDefault();
    }

    useEffect(()=>{    // useEffect to send a private message to the current user via socket
        if(sendingMessage){
            const username=currentChatUser.username;
            socket.emit('privateMessage',  { recieverUsername: currentChatUser.username, senderUsername: localStorage.getItem('username'), message: currentMessage }); 
            setCurrentMessage("")
        }
        setSendingMessage(false)
        const div = scrollBottomRef.current;
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    },[sendingMessage])

    function logOut(){
        localStorage.removeItem('token')
        localStorage.removeItem('chat-list')
        socket.emit('unregster', localStorage.getItem('username'))
        socket.emit('update_status', localStorage.getItem('username'), false )
        localStorage.removeItem('username')
        navigate('login')
        
    }
  return (
    
    <div className='chat-page'>
        <div className='header'>Let's Chat</div>
        <button className="logout-button" onClick={logOut}><LogoutIcon sx={{color:"white", width:'20px', height:'20px'}}/></button>
        <div className={`List ${!currentChatUser.username?`show`:null}`}>
            <div className='action'>
                <div className="nav">
                    <h2>Chats</h2>
                    <IconButton onClick={()=>{setAddingNewChat(true)}} sx={{height:"fit-content"}}aria-label="delete">
                        <AddCircleIcon sx={{color:"white"}}/>
                    </IconButton>
                </div>
                <input type='text' placeholder={addingNewChat?"enter username":"search for a chat"} onChange={(e)=>{handleChange(e)}} name="searchChat" value={inputValue}/>
            </div>
            <div className='chat-list'>
                {!addingNewChat?chatList.map((value, index)=>{
                    return (
                        <div key={index} className='list-item' onClick={()=>{startChatting(index)}}>
                            {value.unread?<div className="unread-badge"></div>:null}
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            <h3>{value.name}</h3>
                        </div>
                    )
                }):searched.map((value, index)=>{
                    return (
                        <div key={index} className='list-item' onClick={()=>{startChatting(index)}}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            <h3>{value.name}</h3>
                        </div>
                    )
                })}
            </div>
        </div>
        <div className={`message ${currentChatUser.username?`show`:null}`}>
            <div className='after'>
                {currentChatUser.username?
                    <div className="profile-tab">
                        <IconButton type="submit" onClick={()=>{setCurrentChatUser({username:"", name:""})}} sx={{height:"fit-content", padding:"0px"}}>
                            <ArrowBackIosIcon sx={{color:"white"}}/>
                        </IconButton>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <div className="nameAndStatus">
                        <h2>{currentChatUser.name}</h2>
                        {chatList_updateStatus[currentChatUser.username]?<p className='online-status'>online</p>:null}
                        </div>
                        
                    </div>:null}
                {currentChatUser.username?
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
                {currentChatUser.username?<form onSubmit={sendMessage}  className="messaging-tab">
                    <input type="text" value={currentMessage} onChange={(e)=>{handleChange(e)}} name="message" placeholder='Type a Message....'/>
                    <IconButton type="submit" onClick={sendMessage} sx={{height:"fit-content", padding:"0px"}}>
                        <SendIcon sx={{color:"white"}}/>
                    </IconButton>
                </form>:null}
            </div> 
        </div>
    </div>
  )
}

export default Chat
