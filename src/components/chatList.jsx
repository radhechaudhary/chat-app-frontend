import React, {  useEffect, useRef} from 'react'
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Avatar from '@mui/material/Avatar';
import Add from './add';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ChatList({socket, ChatMessages, newGroupList, setNewGroupList, currentChatUser, inputValue, setInputValue, setCurrentChatUser, setChatList, chatList, setAddingNewChat, addingNewChat, startChatting, searched, setSearched, makingGroup, setMakingGroup, isTyping, setIsTyping, chatList_updateStatus} ) {

    

    function handleChange(e){ // function to handle change is the searchbar 
        setInputValue(e.target.value);  
    }
    useEffect(()=>{   // to add new chat via entering username which triggers when input value changes
        if(addingNewChat && !makingGroup && inputValue.trim().length>=8){
            socket.emit('newChat', inputValue)
            socket.on('AddnewChat', (message)=>{  
                if(message.username){
                    if(message.username!==localStorage.getItem('username') && chatList.find((user)=> user.username===message.username )===undefined){
                        setSearched([message])
                    }  
                }
                else{
                    setSearched([])
                }
            })
        }
        if(makingGroup &&  inputValue.trim().length>=0){
            setSearched(chatList.filter((value)=>{
                return (value.name.toLowerCase().includes(inputValue.toLowerCase()) || value.username.includes(inputValue))&& value.type!=='group';
            }));
            if(inputValue.trim().length>=10){
                socket.emit('newChat', inputValue)
                socket.on('AddnewChat', (message)=>{
                    if(message.username){
                        if(message.username!==localStorage.getItem('username') && chatList.find((user)=> user.username===message.username )===undefined){
                            setSearched([message, ...searched])
                        }  
                    socket.off('AddnewChat')
                    }
                    else{
                        socket.off('AddnewChat')
                    }
                })
            }
        }
        return ()=>{
            socket.off('AddnewChat')
        }
    },[inputValue])

    useEffect(()=>{  // useEffect to save the chat list to local storage when it changes
        if(chatList.length>0) localStorage.setItem('chat-list',JSON.stringify(chatList))
       
    },[chatList])

    function startChatting(indx){ // function to change or start the current chat....
        socket.off('isOnline')
        if(addingNewChat){
            const curr={...searched[indx], type:'private'}
            socket.emit('isOnline', (curr.username)); 
            
            setCurrentChatUser(curr)
            setChatList([{...searched[0], type:"private", unread:false, unreadMessagesCount:0},...chatList])
            setSearched([])
            setAddingNewChat(false)
            setInputValue("")
        }
        else{
            var updatedChatList = chatList.map((chat, index) => { // function to update unread on opening messages!
                if (indx === index) {
                    // Return the updated object
                    return { ...chat, unread:false, unreadMessagesCount:0 };  // Update the message
                }
                return chat;  // Return the original object if no match
            }) 
            setCurrentChatUser(updatedChatList[indx])
            setChatList(updatedChatList)
            socket.emit('update_data', updatedChatList);
            socket.on('update_data',(list)=>{
                setCurrentChatUser({...list[indx]})
                setChatList(list);
            })
               
        }
        setInputValue("")    
    }
    let interval;
    useEffect(()=>{ //  to emit reuest to get active status repeatedly when currentChatuser Changes
        if(currentChatUser.username){
            interval=setInterval(()=>{
                if(socket.connected() && currentChatUser.username){
                    socket.emit('isOnline', (currentChatUser.username))
                }
            }, 3000);
        }
        return()=>{
            clearInterval(interval);
        } 
    },[currentChatUser])
    useEffect(()=>{  // to recieve active status for currUser
        socket.on('isOnline', (isOnline)=>{
            setCurrentChatUser((prev)=>({...prev, isOnline:isOnline}))
        }) 
        return()=>{
            socket.off('isOnline')
        }
    })

  return (
      <div className={`List ${!currentChatUser.username?'show':null}`}>
            <div className='action'>
                <div className="nav">
                    <h2>Chats</h2>
                    <IconButton onClick={()=>{setAddingNewChat(!addingNewChat)}} sx={{height:"fit-content"}}aria-label="delete">
                        <AddCircleIcon sx={{color:"white"}}/>
                    </IconButton>
                </div>
                <input type='text' placeholder="search for a chat" onChange={(e)=>{handleChange(e)}} name="searchChat" value={!addingNewChat?inputValue:""}/>
            </div>
            <div className='chat-list'>
                {chatList.map((value, index)=>{
                    return (
                        <div key={index} className={`list-item ${value.username===currentChatUser.username?'list-item-on-focus':null}`} onClick={!addingNewChat?()=>{startChatting(index)}:()=>{setAddingNewChat(false)}}>
                            {value.unread?<div className="unread-badge"><p style={{margin:'0', padding:'0', fontSize:'10px', fontWeight:'300', color:'rgba(40, 39, 40, 0.9)'}}>{value.unreadMessagesCount}</p></div>:null}
                            <MoreVertIcon className="more-button"/>
                            <Avatar alt="Remy Sharp" src={value.type==='group'?"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0somSUm3IdLDiKcjOB2elzR8A_JgAxponNQ&s":value.profilephoto}/>
                            <div>
                                <h3 style={{fontWeight:'300', fontSize:"16px", marginBottom:"0px"}}>{value.name}</h3>
                                {isTyping[value.username] && currentChatUser.username!==value.username?<p style={{fontSize:"12px", color:"rgb(223, 73, 223)", margin:"0px"}}>typing...</p>:ChatMessages[value.username]?<p style={{fontSize:"12px", color:"rgb(100, 100, 100)", margin:"0px", width:'130px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow:'hidden'}}>{ChatMessages[value.username][ChatMessages[value.username].length-1].sentBy==="me"?<span>me:  </span>:value.type==="group"?<span>{`${ChatMessages[value.username][ChatMessages[value.username].length-1].sender}:`}</span>:null}{ChatMessages[value.username][ChatMessages[value.username].length-1].message}</p>:<p style={{fontSize:"12px", color:"rgb(100, 100, 100)", margin:"0px"}}>...</p>}
                            </div>
                            
                        </div>
                    )
                })}
            </div>
            <Add handleChange={handleChange} socket={socket} currentChatUser={currentChatUser} inputValue={inputValue} setInputValue={setInputValue} setCurrentChatUser={setCurrentChatUser} setChatList={setChatList} chatList={chatList} setAddingNewChat={setAddingNewChat} addingNewChat={addingNewChat}  searched={searched} setSearched={setSearched} makingGroup={makingGroup} setMakingGroup={setMakingGroup} newGroupList={newGroupList} setNewGroupList={setNewGroupList} startChatting={startChatting}/>
        </div>
  )
}

export default ChatList
