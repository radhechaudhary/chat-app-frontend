<<<<<<< HEAD
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GroupsIcon from '@mui/icons-material/Groups';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import MakeGroup from './makeGroup';

function Add({socket, handleChange, newGroupList, setNewGroupList,currentChatUser, inputValue, setInputValue, setCurrentChatUser,  chatList, setAddingNewChat, addingNewChat, startChatting, searched, setSearched, makingGroup, setMakingGroup}) {
  return (
            <div className={`newChat ${addingNewChat?"expandNewChat":null}`}>
                <h2  style={{color:"white"}}>
                       <IconButton type="submit" onClick={()=>{setAddingNewChat(false); setSearched([])}} sx={{height:"fit-content", padding:"0px"}}>
                            <ArrowBackIosIcon sx={{color:"white", fontSize:"20px"}}/>
                        </IconButton>
                    New Chat
                </h2>
                <input type='text' placeholder="enter username" onChange={handleChange} name="searchChat" value={!makingGroup?inputValue:""}/>
                <div className='makeGroupButton' onClick={()=>{setSearched(chatList.filter((chat)=>{return chat.type!=='group'})); setMakingGroup(!makingGroup); }}>
                    <GroupsIcon sx={{color:"rgb(223,73,223)"}}/>
                    <h3 style={{color:'white', margin:'10px 0px', fontWeight:"400"}}> New Group</h3>
                </div>
                <MakeGroup socket={socket} handleChange={handleChange} inputValue={inputValue} setInputValue={setInputValue} currentChatUser={currentChatUser} setCurrentChatUser={setCurrentChatUser}  chatList={chatList} setAddingNewChat={setAddingNewChat} addingNewChat={addingNewChat}  searched={searched} setSearched={setSearched} makingGroup={makingGroup} setMakingGroup={setMakingGroup} newGroupList={newGroupList} setNewGroupList={setNewGroupList} startChatting={startChatting}/>
                <div className='searchedList'>  
                    {!makingGroup?searched.map((value, index)=>{
                        return (
                            <div key={index} className='list-item' onClick={()=>{startChatting(index); setSearched([])}}>
                                <Avatar alt="Remy Sharp" src={value.profilephoto} />
                                <h3 style={{fontWeight:'300', fontSize:"16px"}}>{value.name}</h3>
                            </div>
                        )
                    }):null}
                </div>
            </div>
  )
}

export default Add
=======
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GroupsIcon from '@mui/icons-material/Groups';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import MakeGroup from './makeGroup';

function Add({socket, handleChange, newGroupList, setNewGroupList,currentChatUser, inputValue, setInputValue, setCurrentChatUser,  chatList, setAddingNewChat, addingNewChat, startChatting, searched, setSearched, makingGroup, setMakingGroup}) {
  return (
    <div className={`newChat ${addingNewChat?"expandNewChat":null}`}>
                <h2  style={{color:"white"}}>
                       <IconButton type="submit" onClick={()=>{setAddingNewChat(false); setSearched([])}} sx={{height:"fit-content", padding:"0px"}}>
                            <ArrowBackIosIcon sx={{color:"white", fontSize:"20px"}}/>
                        </IconButton>
                    New Chat</h2>
                <input type='text' placeholder="enter username" onChange={handleChange} name="searchChat" value={!makingGroup?inputValue:""}/>
                <div className='makeGroupButton' onClick={()=>{setSearched(chatList.filter((chat)=>{return chat.type!=='group'})); setMakingGroup(!makingGroup); }}>
                    <GroupsIcon sx={{color:"rgb(223,73,223)"}}/>
                    <h3 style={{color:'white', margin:'10px 0px', fontWeight:"400"}}> New Group</h3>
                </div>
                <MakeGroup socket={socket} handleChange={handleChange} inputValue={inputValue} setInputValue={setInputValue} currentChatUser={currentChatUser} setCurrentChatUser={setCurrentChatUser}  chatList={chatList} setAddingNewChat={setAddingNewChat} addingNewChat={addingNewChat}  searched={searched} setSearched={setSearched} makingGroup={makingGroup} setMakingGroup={setMakingGroup} newGroupList={newGroupList} setNewGroupList={setNewGroupList} startChatting={startChatting}/>
                <div className='searchedList'>  
                    {!makingGroup?searched.map((value, index)=>{
                        return (
                            <div key={index} className='list-item' onClick={()=>{startChatting(index); setSearched([])}}>
                                <Avatar alt="Remy Sharp" src={value.profilephoto} />
                                <h3 style={{fontWeight:'300', fontSize:"16px"}}>{value.name}</h3>
                            </div>
                        )
                    }):null}
                </div>
            </div>
  )
}

export default Add
>>>>>>> 8dc72b2168d9bb1c0b390dca4abf44bc1b1356cd
