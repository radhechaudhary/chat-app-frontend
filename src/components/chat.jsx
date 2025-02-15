import React, { useState, useEffect, useRef} from 'react'
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Messages from './messages';
import ChatList from './chatList';
import { Avatar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import img from './icon.png'
import sound from './tone.mp3'





const socket = io("https://chat-app-backend-production-bd09.up.railway.app", {
    query: { userId: localStorage.getItem("username") },
    transports: ["websocket"], // ✅ Force WebSockets instead of polling
    withCredentials: true,
    reconnection: true,        // ✅ Enable automatic reconnection
    reconnectionAttempts: 100,   // ✅ Try reconnecting up to 5 times
    reconnectionDelay: 2000,   // ✅ Wait 2 seconds before retrying
    reconnectionDelayMax: 5000 // ✅ Max delay of 5 seconds
});

  
  
function Chat() {
    
    const navigate=useNavigate();

    const [chatList, setChatList]=useState([]);
    const [chatList_updateStatus, setChatList_updateStatus]=useState({})
    const [searched, setSearched]=useState([])
    const [currentChatUser, setCurrentChatUser]=useState({username:"", name:"", online:null});
    const [ChatMessages, setChatMessages]=useState({})
    const [inputValue, setInputValue]=useState("");
    const [addingNewChat, setAddingNewChat]=useState(false)
    const [makingGroup, setMakingGroup]=useState(false);
    const [newGroupList, setNewGroupList]=useState([]);
    const [isTyping, setIsTyping]=useState({})
    const [prevSender, setprevSender]=useState("");
    const [openedSettings, setopenedSettings]=useState(false);
    const [editingData, setEditingData]=useState(false);
    const [nameInputValue, setNameInputValue]=useState(localStorage.getItem('name'));
    const [bioInputValue, setBioInputValue]=useState(localStorage.getItem('bio') || "hey! I am using Let'sChat");
    const [updated_profile_photo, set_updated_profile_photo]=useState(null);
    const [image, setImage]=useState(null);
    const [uploading_data, setUploading_data]=useState(false);
    const [showAlert, setShowAlert] = useState(false);


    useEffect(()=>{  // get added in  group
        function createGroup({groupName, username, members, admin}){
            setChatList((prev)=>[{name:groupName, username:username, members:members, admin:admin, type:"group", unread:true, unreadMessagesCount:1},...prev])
        }
        socket.on('addInGroup', createGroup);
        return ()=>{
            socket.off('addInGroup')
        }
    }, [])// add In Group

    useEffect(() => {   // useEffect to add event listner for visibility and unloading
        const handleBeforeUnload = (event) => {
            if(localStorage.getItem('username')){
                socket.emit('update_status', localStorage.getItem('username'), false )
                socket.emit('update_active_status_false', localStorage.getItem('username'), false )
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                if(localStorage.getItem('username')){
                    socket.emit('update_status', localStorage.getItem('username'), false )
                }
            } else if (document.visibilityState === 'visible') {
                if(localStorage.getItem('username')){
                    socket.emit('update_status', localStorage.getItem('username'), true )
                }
            }
        };

        // Attach event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        
    }, []);
    
    useEffect(()=>{  // useEffect which runs when component mounts
        if(localStorage.getItem('chat-list') && chatList.length===0){
            socket.emit('update_data', JSON.parse(localStorage.getItem('chat-list')));
             socket.on('update_data', (list)=>{
                setChatList(list)
            })
        }
        if(localStorage.getItem('messages') && Object.keys(ChatMessages).length===0){
            const messages=JSON.parse(localStorage.getItem('messages'))
            setChatMessages({...messages})
        }
        socket.on('connect',()=>{
            console.log("✅ Reconnected!");
            socket.emit("get_saved_messages", localStorage.getItem("username"));
        })
        socket.emit('update_status', localStorage.getItem('username'), true );
        return()=>{
            socket.off('connect')
        }
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

    const moveUserToTop = (list, username) => { // function to move the chat to top when messge recieved
        const objToMove = list.find((item) => item.username === username);
        return objToMove
            ? [objToMove, ...list.filter((item) => item.username !== username)]
            : list;
    };

    useEffect(() => {  // to recieve private messages
        var added= new Set();
        
        const handlePrivateMessage = ({ username, message, time }) => {
            setChatMessages((prevChatMessages) => {
                const updatedMessages = {
                    ...prevChatMessages,
                    [username]: [...(prevChatMessages[username] || []), { sentBy: "partner", message, time }],
                };
    
                // Update chatList within the same setState call
                setChatList((prevChatList) => {
                    const userExists = prevChatList.some((user) => user.username === username);
                    if (userExists || added.has(username)) {
                        console.log('message count')
                        const updatedChatList = prevChatList.map((chat) =>
                            chat.username === username && username !== currentChatUser.username
                                ? { ...chat, type:'private', unread: true, unreadMessagesCount:chat.unreadMessagesCount+1 }
                                : chat
                        );
    
                        const objToMove = updatedChatList.find((item) => item.username === username);
                        return objToMove
                            ? [objToMove, ...updatedChatList.filter((item) => item.username !== username)]
                            : updatedChatList;
                    } else {
                        socket.emit('newChat', username);
                        socket.on('AddnewChat', (user) => {
                            if (user.username && !added.has(user.username)) {
                                added.add(user.username)
                                setChatList((prevList) => [
                                    { ...user, type: "private", unread: true , unreadMessagesCount:1},
                                    ...prevList,
                                ]); 
                            }
                        });
                        return prevChatList;
                    }
                });
                return updatedMessages;
            });
        };

        // saved-messages
        const handleSavedMessage=(messages)=>{
            Object.keys(messages).map((username)=>{
                messages[username].map((message)=>{
                  handlePrivateMessage({username:username,  message: message.message, time:message.time});
                })
            })
        }

    
        // Socket listeners
        socket.on('privateMessage', handlePrivateMessage);
        socket.on('saved-messages', handleSavedMessage);
        return () => {
            socket.off('privateMessage', handlePrivateMessage);
            socket.off('saved-messages', handleSavedMessage);
        };
    }, [currentChatUser]);
    
    useEffect (()=>{ // recieve group messages
        
        function handleGroupMessage({username, sender, message, time}){
            
            if(username!==currentChatUser.username){
                const audio= new Audio(sound)
                audio.play()
            }
            
            var currSender=sender;
            console.log(prevSender)
            if(currSender!==prevSender){
                if(ChatMessages[username]){
                    setChatMessages((prev) => ({
                        ...prev,
                        [username]: [...prev[username], {sentBy:'senderName', message:prevSender}]
                    }));
                }
                setprevSender(currSender)
            }
            if (ChatMessages[username]) {
                setChatMessages((prev) => ({
                    ...prev,
                    [username]: [...prev[username], { sentBy: "partner", message:message, sender:sender, time:time }]
                }));
            } else {
                setChatMessages((prev) => ({
                    ...prev,
                    [username]: [{ sentBy: "partner", message:message, sender:sender, time:time}]
                }));
            }
            const updatedChatList = chatList.map((chat) => {
                if (username === chat.username && username !== currentChatUser.username) {
                    return { ...chat, unread: true , unreadMessagesCount:chat.unreadMessagesCount+1};
                }
                else return chat;
            });
            setChatList(updatedChatList);

            // Move the user to the top of the list
            setChatList((prevItems) => {
                const objToMove = prevItems.find((item) => item.username ===username );
                if (!objToMove) return prevItems;
                return [objToMove, ...prevItems.filter((item) => item.username !== username)];
            });
        }
        socket.on('groupMessage', handleGroupMessage);
        return ()=>{
            socket.off('groupMessage')
        }
    },[chatList, ChatMessages, currentChatUser]) 

    function logOut(){ // logout
        localStorage.removeItem('token')
        localStorage.removeItem('chat-list')
        socket.emit('unregister', localStorage.getItem('username'))
        localStorage.removeItem('username')
        localStorage.removeItem('messages')
        localStorage.removeItem('profile-photo')
        localStorage.removeItem('bio');
        navigate('login')
    }
    useEffect(()=>{
        setInputValue("")
    },[addingNewChat, makingGroup])

    function openSettings(e){ // function to open settings
        if(addingNewChat){
            setAddingNewChat(false)
            if(makingGroup){
                setMakingGroup(false);
                setSearched([])
            }
        }

        setopenedSettings(!openedSettings)
    }
    function startEditingProfile(){ // function to start editing
        setEditingData(true);
    }
    function stopEditing(){ // function to stop editing
        if(editingData){
            setNameInputValue(localStorage.getItem('name'))
            setBioInputValue("Hey! there i'm using let's chat" || localStorage.getItem('bio'))
            set_updated_profile_photo(null);
            setImage(null);
            setEditingData(false);
        }
    }
    function handleChange(e){ // handle change for name and bio in editing section
        if(e.target.name==='bio'){
            if(e.target.value.length<=100){
                setBioInputValue(e.target.value);
            }
        }     
        else if(e.target.name==='name'){
            if(e.target.value.length<=15){
                setNameInputValue(e.target.value);
            }   
        }   
    }
    function handleImageChange(e){ // hande image Change  
        // alert('images uploaded')
          const file=e.target.files[0];
          if (file) {
            setImage(file)
            const reader = new FileReader();
            reader.onloadend = () => {
              set_updated_profile_photo(reader.result); // Set the image data to the state
            };
            reader.readAsDataURL(file); // Read the file as a data URL
          }
      }
    function saveEditData(){ // function save the edited data
        setEditingData(false);
        if(nameInputValue!==localStorage.getItem('name') || bioInputValue!==localStorage.getItem('bio') || updated_profile_photo){
            localStorage.setItem('name', nameInputValue);
            localStorage.setItem('bio', bioInputValue);
            setShowAlert(true);
            setTimeout(()=>{
                setShowAlert(false)
            },(1500))
            setUploading_data(true);
        }
        
    }
    useEffect(()=>{ // useEffect to upload the edited data to backend
        if(uploading_data){
            set_updated_profile_photo(null);
            const formData = new FormData();
            formData.append('file', image);
            formData.append('username', localStorage.getItem('username'));
            formData.append('name', nameInputValue);
            formData.append('bio', bioInputValue);
            axios.post('https://chat-app-backend-production-bd09.up.railway.app/edit-profile', formData,  {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            })
            .then((response)=>{
               localStorage.setItem('profile-photo', response.data.photo_url);
            })
            .catch((err)=>{
                console.log(err.message);
            })
            setUploading_data(false);
        }
    },[uploading_data])
return (
    <div className='chat-page'>
            <div className='header'><img src={img}/> Let's Chat</div>
            
            <ChatList socket={socket} stopEditing={stopEditing} chatList_updateStatus={chatList_updateStatus} openSettings={openSettings} setopenedSettings={setopenedSettings} setEditingData={setEditingData} isTyping={isTyping} setIsTyping={setIsTyping} currentChatUser={currentChatUser} inputValue={inputValue} setInputValue={setInputValue} setCurrentChatUser={setCurrentChatUser} setChatList={setChatList} chatList={chatList} setAddingNewChat={setAddingNewChat} addingNewChat={addingNewChat} searched={searched} setSearched={setSearched} makingGroup={makingGroup} setMakingGroup={setMakingGroup} newGroupList={newGroupList} setNewGroupList={setNewGroupList} ChatMessages={ChatMessages} />

            <Messages stopEditing={stopEditing} setopenedSettings={setopenedSettings} openSettings={openSettings} setEditingData={setEditingData} prevSender={prevSender} setprevSender={setprevSender} socket={socket} isTyping={isTyping} setIsTyping={setIsTyping} currentChatUser={currentChatUser} setCurrentChatUser={setCurrentChatUser} chatList_updateStatus={chatList_updateStatus} ChatMessages={ChatMessages} setChatMessages={setChatMessages}/>

            <div className='profile-photo-and-setting profile-photo' style={{position:'absolute', bottom:'10px', left:'25px' , transform:'translate(-50%, 0%)', display:'flex', flexDirection:'column', gap:'10px'}}>
                    <Avatar alt="Remy Sharp" sx={{width:'30px', height:'30px'}} src={updated_profile_photo || localStorage.getItem('profile-photo')} />
                    <SettingsIcon onClick={openSettings} sx={{color:'white', width:'30px', height:'30px', cursor:'pointer'}}/>
                    <div className={`settings ${openedSettings?'showSettings':null} ${editingData?'editingData':null}`}>
                        {!editingData?<h1 style={{color:'white', marginBottom:'0'}}>
                            <ArrowBackIosIcon onClick={openSettings} sx={{color:"white", cursor:'pointer',}}/>
                            Settings</h1>:null}
                        {!editingData?<div className='profile-edit settings-item' onClick={startEditingProfile}>
                            <Avatar src={updated_profile_photo || localStorage.getItem('profile-photo')} alt="Remy Sharp" sx={{width:'50px', height:'50px', cursor:'pointer'}}/>
                            <div className='name-and-bio'>
                                <h3 style={{color:'white', fontSize:'18px', margin:'0', cursor:'pointer',  width:'160px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow:'hidden'}}>{localStorage.getItem('name')}</h3>
                                <p style={{color:'rgb(197, 195, 195)', cursor:'pointer',margin:'0', width:'160px', fontSize:'12px', fontWeight:'lighter', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow:'hidden'}}> {localStorage.getItem('bio') || "hey! I am using Let'sChat"}</p>
                            </div>
                            <ArrowForwardIcon sx={{color:'white', position:'absolute', top:'50%', transform:'translate(0%, -50%)', cursor:'pointer', right:'5px'}}/>
                        </div>:null}
                        {!editingData?<button className='logout settings-item' style={{display:'flex', color:'white'}} onClick={logOut}>Logout <LogoutIcon sx={{color:"white", width:'20px', height:'20px'}}/></button>:null}
                        {editingData?
                        <form className='edit-profile' style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                            <h1 style={{color:'white'}}>
                                <ArrowBackIosIcon onClick={()=>{stopEditing();  setImage(null); set_updated_profile_photo(null)}} sx={{color:"white", cursor:'pointer',}}/>
                                Your Profile
                            </h1>
                            <div className='name-and-photo' style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', backgroundColor:'rgb(87, 87, 87)', borderRadius:'5px', padding: '10px 5px'}}>
                                <div className='photo-and text' style={{display:'flex', padding:'5px',  flexDirection:'row', gap:'10px',  width:'fit-content'}}>
                                    <div className='photo-and edit-button' style={{display:'flex', flexDirection:'column', alignItems:'center', width:'fit-content'}}>
                                        <Avatar alt="Remy Sharp" src={updated_profile_photo || localStorage.getItem('profile-photo')} sx={{width:'50px', height:'50px'}}/>
                                        <input id='update-photo' type='file' accept="image/*" onChange={handleImageChange} style={{display:'none'}}/>
                                        <label htmlFor='update-photo'  style={{border:'none', cursor:'pointer', backgroundColor:'transparent', color:'rgb(223,73,223)'}}>Edit</label>
                                    </div>
                                    <p style={{color:'rgb(147, 146, 146)', fontSize:'14px', margin:'0'}}>Choose a Name or an Option photo</p>
                                </div>
                                <div className='edit-name' style={{width:'100%', display:'flex',  gap:'5px', justifyContent:'center',  borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px'}}>
                                    <input type='text' onChange={handleChange} placeholder='Name' name='name' value={nameInputValue} style={{fontSize:'16px', padding:'10px 5px', width:'90%', border:'none', borderBottom:'1px solid rgb(147, 146, 146)', borderTop:'1px solid rgb(147,146,146', backgroundColor:'rgb(87, 87, 87)', color:'white'}}/>
                                </div> 
                            </div>
                            <div className='username' >
                                <p style={{margin:'0', color:'rgb(147,147,147)'}}>username</p>
                                <p style={{width:'100%', padding:'10px 5px', border:'none',  backgroundColor:'rgb(87, 87, 87)', color:'white', borderRadius:'5px', fontSize:'14px', margin:'0'}}>{localStorage.getItem('username')}</p>
                            </div>
                            <div className='edit-bio'>
                            <p style={{margin:'0', color:'rgb(147,147,147)'}}>Bio</p>
                                <textarea onChange={handleChange} style={{width:'100%', padding:'10px 5px', border:'none',  backgroundColor:'rgb(87, 87, 87)', color:'white', borderRadius:'5px'}} placeholder='Bio' name='bio' value={bioInputValue}></textarea>
                            </div>
                            <button onClick={saveEditData} type='submit' style={{color:'rgb(197, 197, 197)', fontSize:'16px', cursor:'pointer', backgroundColor:'rgb(223, 73, 223)' ,border:'none', borderRadius:'5px',width:'fit-content', position:'relative', left:'232px'}}>Done</button>
                        </form>
                        :null}
                    </div>
            </div>
            {showAlert &&(
        <Alert icon={<CheckIcon fontSize="inherit" />} style={{position:'absolute', bottom:"100px", left:'50%', transform:'translate(-50%, -50%)'}} severity="success" onClose={() => setShowAlert(false)}>
            Profile Updated Successfully
        </Alert>
    )}
    </div>
)}

export default Chat
