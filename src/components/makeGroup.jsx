<<<<<<< HEAD
import React  from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CancelIcon from '@mui/icons-material/Cancel';

function MakeGroup({socket, makingGroup, setMakingGroup, setNewGroupList,setAddingNewChat,  handleChange, inputValue, searched, setSearched, newGroupList}) {
    const [groupName, setGroupName]=React.useState('');
    const [noGroupName, setNoGroupName]=React.useState(false)

    function makeGroupName(e){ 
        const name=e.target.value;
        setGroupName(name);
    }

    function addGroupMember(user, index){    // add Group member..........
        if(newGroupList.find((member)=> member.username===user.username)!==undefined){
            setNewGroupList(newGroupList.filter((val)=>{
                return val.username !== user.username;
            }))
        }
        else setNewGroupList([...newGroupList, user]);
    }
    function removeMember(user){      
        setNewGroupList(newGroupList.filter((val)=>{
            return val.username !== user.username;
        }))
    }

    function makeGroup(){
        const date=new Date();
        const time= date.getHours() +":"+ date.getMinutes();
        if(groupName.trim()===""){
            setNoGroupName(true);
            return;
        }
        setMakingGroup(false) // remove making group component from window
        setAddingNewChat(false) // remove adding chat comonent from window
        socket.emit('makeGroup',  { groupList:[{ name:localStorage.getItem('name'), username:localStorage.getItem('username'), profilephoto:localStorage.getItem('profile-photo'), bio:localStorage.getItem('bio')}, ...newGroupList] , username:(Math.floor(Math.random()*10000)).toString()+new Date().getTime(), groupName:groupName, admin: localStorage.getItem('username'), time:time });
        setNewGroupList([]); // resetting all the values
        setSearched([]);
        setGroupName('');
        setNoGroupName(false)
        setNewGroupList([])
        
    }
   

    return (
               <div className={`makeGroup ${makingGroup?'expandMakeGroup':null}`} >
                    <h2 style={{color:"white", width:'90%'}}>
                       <IconButton type="submit" onClick={()=>{setMakingGroup(false); setSearched([]); setNewGroupList([])}} sx={{height:"fit-content", padding:"0px"}}>
                            <ArrowBackIosIcon sx={{color:"white", fontSize:"20px"}}/>
                        </IconButton>
                        New Group
                    </h2>
                    {newGroupList.length!==0?<div className='groupMembersList'>{newGroupList.map((value, index)=>{return(<div key={index}><p key={index}>{value.name}</p><CancelIcon onClick={()=>removeMember(value)} sx={{color:"white",width:"10px" , height:"10px"}}/></div>)})}</div>:null}
                    {newGroupList.length!==0?<div style={{width:'90%',height:'max-content', display:'flex', gap:'10px', alignItems:'baseline', marginBottom:'5px'}} className='proceed'>
                        <input style={!noGroupName?{flex:'1', padding:'5px 0px'}:{flex:'1', padding:'5px 0px', border:'1px solid red'}} type='text' onChange={makeGroupName} placeholder={noGroupName?"Name Required":"Group Name"} name='groupName' value={groupName} ></input>
                        <Button style={{color:'white', backgroundColor:'rgb(223, 73, 223)', borderRadius:'5px', padding:'5px 0px', boxSizing:'border-box'}} onClick={makeGroup}> NEXT</Button>
                    </div>:null}
                    <input type='text' placeholder="enter username" onChange={(e)=>{handleChange(e)}} name="searchChat" value={makingGroup?inputValue:""}/>
                    <div className='GroupMembersList'>
                        {makingGroup?searched.map((value, index)=>{
                        return (
                            <div key={index} className='list-item' onClick={()=>{addGroupMember(value, index)}}>
                                <Avatar alt="Remy Sharp"  src={value.profilephoto} />
                                <h3 style={{fontWeight:'300', fontSize:"16px"}}>{value.name}</h3>
                            </div>
                        )
                    }):null}
                    </div>
                </div>
    )
}

export default MakeGroup;
=======
import React  from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CancelIcon from '@mui/icons-material/Cancel';

function MakeGroup({socket, makingGroup, setMakingGroup, setNewGroupList,setAddingNewChat,  handleChange, inputValue, searched, setSearched, newGroupList}) {
    const [groupName, setGroupName]=React.useState('');
    const [noGroupName, setNoGroupName]=React.useState(false)

    function makeGroupName(e){
        const name=e.target.value;
        setGroupName(name);
    }

    function addGroupMember(user, index){  // add Group member
        if(newGroupList.find((member)=> member.username===user.username)!==undefined){
            setNewGroupList(newGroupList.filter((val)=>{
                return val.username !== user.username;
            }))
        }
        else setNewGroupList([...newGroupList, user]);
    }
    function removeMember(user){
        var index=0;
        
        setNewGroupList(newGroupList.filter((val)=>{
            return val.username !== user.username;
        }))
    }

    function makeGroup(){
        const date=new Date();
        const time= date.getHours() +":"+ date.getMinutes();
        if(groupName.trim()===""){
            setNoGroupName(true);
            return;
        }
        setMakingGroup(false)
        setAddingNewChat(false)
        socket.emit('makeGroup',  { groupList:[{ name:localStorage.getItem('name'), username:localStorage.getItem('username'), profilephoto:localStorage.getItem('profile-photo'), bio:localStorage.getItem('bio')}, ...newGroupList] , username:(Math.floor(Math.random()*10000)).toString()+new Date().getTime(), groupName:groupName, admin: localStorage.getItem('username'), time:time });
        setNewGroupList([]);
        setSearched([]);
        setGroupName('');
        setNoGroupName(false)
        setNewGroupList([])
        
    }
   

    return (
               <div className={`makeGroup ${makingGroup?'expandMakeGroup':null}`} >
                    <h2 style={{color:"white", width:'90%'}}>
                       <IconButton type="submit" onClick={()=>{setMakingGroup(false); setSearched([]); setNewGroupList([])}} sx={{height:"fit-content", padding:"0px"}}>
                            <ArrowBackIosIcon sx={{color:"white", fontSize:"20px"}}/>
                        </IconButton>
                        New Group
                    </h2>
                    {newGroupList.length!==0?<div className='groupMembersList'>{newGroupList.map((value, index)=>{return(<div key={index}><p key={index}>{value.name}</p><CancelIcon onClick={()=>removeMember(value)} sx={{color:"white",width:"10px" , height:"10px"}}/></div>)})}</div>:null}
                    {newGroupList.length!==0?<div style={{width:'90%',height:'max-content', display:'flex', gap:'10px', alignItems:'baseline', marginBottom:'5px'}} className='proceed'>
                        <input style={!noGroupName?{flex:'1', padding:'5px 0px'}:{flex:'1', padding:'5px 0px', border:'1px solid red'}} type='text' onChange={makeGroupName} placeholder={noGroupName?"Name Required":"Group Name"} name='groupName' value={groupName} ></input>
                        <Button style={{color:'white', backgroundColor:'rgb(223, 73, 223)', borderRadius:'5px', padding:'5px 0px', boxSizing:'border-box'}} onClick={makeGroup}> NEXT</Button>
                    </div>:null}
                    <input type='text' placeholder="enter username" onChange={(e)=>{handleChange(e)}} name="searchChat" value={makingGroup?inputValue:""}/>
                    <div className='GroupMembersList'>
                        {makingGroup?searched.map((value, index)=>{
                        return (
                            <div key={index} className='list-item' onClick={()=>{addGroupMember(value, index)}}>
                                <Avatar alt="Remy Sharp"  src={value.profilephoto} />
                                <h3 style={{fontWeight:'300', fontSize:"16px"}}>{value.name}</h3>
                            </div>
                        )
                    }):null}
                    </div>
                </div>
    )
}

export default MakeGroup;
>>>>>>> 8dc72b2168d9bb1c0b390dca4abf44bc1b1356cd
