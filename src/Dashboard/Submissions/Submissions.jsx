import { ID, Query } from 'appwrite';
import React, { useEffect, useState } from 'react'
import { databases } from '../../lib/appwrite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';

function Submissions() {
  let user = JSON.parse(localStorage.getItem("user"));
  const [Submissions, setSubmissions] = useState([]);
  const [AllSubmissions, setAllSubmissions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [options, setoptions] = useState([]);
  let [Pending, setPending] = useState(0);
  let [Approved, setApproved] = useState(0);
  let [Rejected, setRejected] = useState(0);
  const [count, setCount] = useState(0);
  let role = localStorage.getItem("role");

  Submissions.sort((a,b)=>new Date(b.end).valueOf() - new Date(a.end).valueOf() );
  AllSubmissions.sort((a,b)=>new Date(b.end).valueOf() - new Date(a.end).valueOf() );

  useEffect(()=>{
    databases
      .listDocuments('663190eb001dd2ba5a61','663190fa0031fcaadaae', [Query.equal("assigned_by", user.$id)])
      .then((res)=>{
        setTasks(res.documents)
      })
      .catch((error)=>{
        console.log(error);
    });

      databases
      .listDocuments('663190eb001dd2ba5a61','6638adfb0018aec1717d', [Query.equal("assigned_by", user.$id)])
      .then((res)=>{
        setSubmissions(res.documents)
      })
      .catch((error)=>{
        console.log(error);
    });

    databases
      .listDocuments('663190eb001dd2ba5a61','6638adfb0018aec1717d', [Query.notEqual("assigned_by", user.$id)])
      .then((res)=>{
        setAllSubmissions(res.documents)
      })
      .catch((error)=>{
        console.log(error);
    });
    const interval = setInterval(() => {
      setCount(count + 1);
      }, 1000);

      //Clearing the interval
      return () => clearInterval(interval);
  }, [count])

  function approvesubmission(documentid, taskid, status){
    databases
    .updateDocument(
      '663190eb001dd2ba5a61', // databaseId
      '6638adfb0018aec1717d', // collectionId
      documentid, // documentId
      {
        "Approval_Status" : "Approved"
      }, // data (optional)
  )
  .then((res)=>{
    databases
    .updateDocument(
      '663190eb001dd2ba5a61', // databaseId
      '663190fa0031fcaadaae', // collectionId
      taskid, // documentId
      {
        "status" : status
      }, // data (optional)
  )
  .then((res)=>{
    console.log(res)
  })
  .catch((error)=>{
    console.log(error);
});
  })
  .catch((error)=>{
    console.log(error);
});
  }

  function rejectsubmission(documentid){
    databases
    .updateDocument(
      '663190eb001dd2ba5a61', // databaseId
      '6638adfb0018aec1717d', // collectionId
      documentid, // documentId
      {
        "Approval_Status" : "Rejected"
      }, // data (optional)
  )
  .then((res)=>{
  })
  .catch((error)=>{
    console.log(error);
});
  }

  return (
    <div className='mytasks'>

      <h2 style={{paddingLeft:"10px"}}> SUBMISSIONS</h2>

      <table>
          <tr className='tablehead'>
          <th>Name</th>
          <th>Title</th>
          <th>Current Status</th>
          <th>Updated Status</th>
          <th>Actions</th>
          </tr>
        <tbody>
        {Submissions.map((task) => {
          return <tr key={task.id}>
          <td><p>{task.assignee_name}</p></td>
          <td><p>{task.title}</p></td>
          <td><p>{task.from_status=="Not Started" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.from_status=="Complete" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.from_status=="Incomplete" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> }{task.from_status=="Partially Complete" && <FontAwesomeIcon icon={faCircleHalfStroke} style={{color: "#FFD43B",}} /> }{task.from_status=="Issue" && <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#B197FC",}} /> }{task.from_status=="On-Leave" && <FontAwesomeIcon icon={faMugHot} style={{color: "grey",}} /> } {task.from_status}</p></td>
          <td><p>{task.status=="Not Started" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.status=="Complete" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.status=="Incomplete" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> }{task.status=="Partially Complete" && <FontAwesomeIcon icon={faCircleHalfStroke} style={{color: "#FFD43B",}} /> }{task.status=="Issue" && <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#B197FC",}} /> }{task.status=="On-Leave" && <FontAwesomeIcon icon={faMugHot} style={{color: "grey",}} /> } {task.status}</p></td>
          {task.Approval_Status!="Pending" && <td><p>{task.Approval_Status=="Pending" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.Approval_Status=="Approved" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.Approval_Status=="Rejected" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> } {task.Approval_Status}</p></td>}
          {task.Approval_Status=="Pending" && <td className='actions'>
            <button style={{background:"blue", color:"white", height:"30px", width:"90px", border:"none", borderRadius:"5px", fontWeight:"600", fontSize:"16px", marginRight:"10px", cursor:"pointer"}} onClick={(e)=>{
              e.preventDefault()
              approvesubmission(task.$id, task.taskid, task.status)
              }}>Approve</button>
            <button style={{background:"red", color:"white", height:"30px", width:"90px", border:"none", borderRadius:"5px", fontWeight:"600", fontSize:"16px", marginRight:"10px", cursor:"pointer"}} onClick={(e)=>{
              e.preventDefault()
              rejectsubmission(task.$id)
              }}>Reject</button>
            </td>}
          </tr>
          })} 
        </tbody>  
      </table>

      {role=="PM" && <>
      <h2 style={{paddingLeft:"10px"}}>OTHER SUBMISSIONS</h2>

      <table>
          <tr className='tablehead'>
          <th>Submitted By</th>
          <th>Submitted To</th>
          <th>Title</th>
          <th>Current Status</th>
          <th>Updated Status</th>
          <th>Actions</th>
          </tr>
        <tbody>
        {AllSubmissions.map((task) => {
          return <tr key={task.id}>
          <td><p>{task.assignee_name}</p></td>
          <td><p>{task.Assigned_by_name}</p></td>
          <td><p>{task.title}</p></td>
          <td><p>{task.from_status=="Not Started" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.from_status=="Complete" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.from_status=="Incomplete" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> }{task.from_status=="Partially Complete" && <FontAwesomeIcon icon={faCircleHalfStroke} style={{color: "#FFD43B",}} /> }{task.from_status=="Issue" && <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#B197FC",}} /> }{task.from_status=="On-Leave" && <FontAwesomeIcon icon={faMugHot} style={{color: "grey",}} /> } {task.from_status}</p></td>
          <td><p>{task.status=="Not Started" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.status=="Complete" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.status=="Incomplete" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> }{task.status=="Partially Complete" && <FontAwesomeIcon icon={faCircleHalfStroke} style={{color: "#FFD43B",}} /> }{task.status=="Issue" && <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#B197FC",}} /> }{task.status=="On-Leave" && <FontAwesomeIcon icon={faMugHot} style={{color: "grey",}} /> } {task.status}</p></td>
          <td><p>{task.Approval_Status=="Pending" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.Approval_Status=="Approved" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.Approval_Status=="Rejected" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> } {task.Approval_Status}</p></td>
          </tr>
          })} 
        </tbody>  
      </table>
      </>}
    </div>
  )
}

export default Submissions