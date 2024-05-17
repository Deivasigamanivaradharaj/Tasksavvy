import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { databases } from "../../lib/appwrite";
import { Query } from "appwrite";

function Sidebar() {
  // let [role, setrole] = useState("TM")
  let role = localStorage.getItem("role");
  let navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user"));
  let activelink=localStorage.getItem("activelink");

  // useEffect(()=>{
  //   databases
  //       .listDocuments('663190eb001dd2ba5a61','663763e6000b018d456e',[Query.equal("$id", user.$id)])
  //       .then((res)=>{
  //          setrole(res.documents[0].Roles[0]);
  //       })
  //       .catch((err)=>{
  //           console.error(err)
  //       })
  // },[])

  return (
    <div className='Sidebar'>
      <div className='logo'>
        <img src={"../images/logo.png"} alt="logo" />
        <h1>Task Savvy</h1>
      </div>
      <ul className='links'>
        <li className={activelink=="1"?"active":""} onClick={(e)=>{
          e.preventDefault()
          localStorage.setItem("activelink", "1")
          if(activelink!="1"){
          navigate('./')
          }
          }}>
          <FontAwesomeIcon icon={faHouse} />
          Dashboard
        </li>
        {role!="PM" && 
        <><li className={activelink=="2"?"active":""} onClick={(e)=>{
          e.preventDefault()
          localStorage.setItem("activelink", "2")
          if(activelink!="2"){
            navigate('./mytasks')
            }
          }}>
          <FontAwesomeIcon icon={faListCheck} />
          My Tasks
        </li>
        <li className={activelink=="3"?"active":""} onClick={(e)=>{
          e.preventDefault()
          localStorage.setItem("activelink", "3")
          if(activelink!="3"){
            navigate('./submittask')
            }
          }}>
          <FontAwesomeIcon icon={faClipboardCheck} />
          Submit Tasks
        </li>
        </>
        }
        
        {role!="TM" && 
        <>
        <li className={activelink=="4"?"active":""} onClick={(e)=>{
          e.preventDefault()
          localStorage.setItem("activelink", "4")
          if(activelink!="4"){
            navigate('./assigntasks')
            }
          }}>
          <FontAwesomeIcon icon={faUserPlus} />
          Assign Task
        </li>
        <li className={activelink=="5"?"active":""} onClick={(e)=>{
          e.preventDefault()
          localStorage.setItem("activelink", "5")
          if(activelink!="5"){
            navigate('./submissions')
            }
          }}>
          <FontAwesomeIcon icon={faClipboardCheck} />
          Submissions
        </li>
        </>
        }

        {role=="PM" &&
        <li className={activelink=="6"?"active":""} onClick={(e)=>{
          e.preventDefault()
          localStorage.setItem("activelink", "6")
          if(activelink!="6"){
            navigate('./managemembers')
            }
          }}>
          <FontAwesomeIcon icon={faMessage} />
          Members
        </li>
        }

        <li className={activelink=="7"?"active":""} onClick={(e)=>{
          e.preventDefault()
          localStorage.setItem("activelink", "7")
          if(activelink!="7"){
            navigate('./chat')
            }
          }}>
          <FontAwesomeIcon icon={faMessage} />
          Chat
        </li>
      </ul>
    </div>
  )
}

export default Sidebar