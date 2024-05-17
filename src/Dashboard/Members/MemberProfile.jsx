import React, { useEffect, useState } from 'react'
import { databases } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';

function MemberProfile() {
    const [User, setUser] = useState([]);
    let [role, setrole] = useState("");
    let [active, setactive] = useState("1")
    let navigate = useNavigate()

    useEffect(()=>{
        let params = new URLSearchParams(location.search);
        console.log(params.get('userid'))
        databases
        .listDocuments('663190eb001dd2ba5a61','663763e6000b018d456e',[Query.equal("$id", params.get('userid'))])
        .then((res)=>{
            console.log(res.documents[0])
            setUser(res.documents[0])
            if(res.documents[0].Roles[0] == "TM"){
              setrole("Team Member")
            }
            if(res.documents[0].Roles[0] == "TL"){
              setrole("Team Lead")
            }
            if(res.documents[0].Roles[0] == "PM"){
              setrole("Project Manager")
            }
        })
        .catch((err)=>{
            console.error(err)
        })

        
    },[])


  return (
    <div className='MemberProfile'>
        <div className="header">
            <p style={{display:"flex",alignItems:"center",gap:"5px"}}><span onClick={(e)=>{
                e.preventDefault()
                navigate("../")
            }}>Employee</span> <FontAwesomeIcon icon={faAngleRight} /> {User.User_name}</p>
            <button><FontAwesomeIcon icon={faPenToSquare} /> Edit Details</button>
        </div>
        <div className="topcontainer">
            <div className="infocontainer1">
                <img className="profileimage" src={"../../images/dp.jpg"}></img>
                <p><b>{User.User_name}</b></p>
                <p style={{color:"red"}}><b>{role}</b></p>
            </div>
            <div className="infocontainer">
                <div className="infogroup">
                    <label htmlFor="firstname">First Name</label>
                    <p>{User.User_name}</p>
                </div>
                <div className="infogroup">
                    <label htmlFor="middlename">Middle Name</label>
                    <p>{"-"}</p>
                </div>
                <div className="infogroup">
                    <label htmlFor="lastname">Last Name</label>
                    <p>{"-"}</p>
                </div>
                <div className="infogroup">
                    <label htmlFor="gender">Gender</label>
                    <p>{"Gender"}</p>
                </div>
            </div>
            <div className="infocontainer">
                <div className="infogroup">
                    <label htmlFor="dob">Date of Birth</label>
                    <p>{"01/01/2000"}</p>
                </div>
                <div className="infogroup">
                    <label htmlFor="location">Location</label>
                    <p>{"Chennai"}</p>
                </div>
                <div className="infogroup">
                    <label htmlFor="email">Email</label>
                    <p>{User.User_Email}</p>
                </div>
                <div className="infogroup">
                    <label htmlFor="phone">Phone</label>
                    <p>{User.User_phone}</p>
                </div>
            </div>
        </div>
        <div className="navbar">
            <b onClick={(e)=>{e.preventDefault();setactive("1")}} className={active=="1"?"navitem active":"navitem"}>Projects</b>
            <b onClick={(e)=>{e.preventDefault();setactive("2")}} className={active=="2"?"navitem active":"navitem"}>Tasks</b>
        </div>
        <div className="bottomcontainer">
            <div className="task">

            </div>
        </div>
        {/* <p>{User.User_name}</p>
        <p>{User.User_phone}</p>
        <p>{User.User_Email}</p>
        <p>{User.Roles[0]}</p>
        <p>{User.Github_Link}</p>
        <p>{User.Linkedin_Url}</p> */}
    </div>
  )
}

export default MemberProfile