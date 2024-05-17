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

function SubmitTask() {

    let user = JSON.parse(localStorage.getItem("user"));

    const [Submissions, setSubmissions] = useState([]);
    const [newsubmission, setnewsubmission] = useState([])
    const [tasks, setTasks] = useState([]);
    const [options, setoptions] = useState([]);
    const [count, setCount] = useState(0);

    let Pending = Submissions.filter((Submission)=>{
      return Submission.Approval_Status=="Pending"
    })
    let Approved = Submissions.filter((Submission)=>{
      return Submission.Approval_Status=="Approved"
    })
    let Rejected = Submissions.filter((Submission)=>{
      return Submission.Approval_Status=="Rejected"
    })
  
    Submissions.sort((a,b)=>new Date(b.end).valueOf() - new Date(a.end).valueOf() );
  
    useEffect(()=>{
      let events = []
      let optionarray = []
      databases
        .listDocuments('663190eb001dd2ba5a61','663190fa0031fcaadaae',[Query.equal("user_id", user.$id)])
        .then((res)=>{
          for(let key in res.documents){
            events.push({...res.documents[key], id:key})
            if(res.documents[key].status!="Complete"){
              optionarray.push("<option value="+res.documents[key].$id+">"+res.documents[key].title+"</option>")
            }
          }
          setTasks(events)
          setoptions(optionarray)
        })
        .catch((err)=>{
          console.error(err)
        })
        
        databases
        .listDocuments('663190eb001dd2ba5a61','6638adfb0018aec1717d', [Query.equal("User_id", user.$id)])
        .then((res)=>{
          setSubmissions(res.documents)
        })
        .catch((error)=>{
          console.log(error);
      });
      const interval = setInterval(() => {
        setCount(count + 1);
        }, 1000);
  
        //Clearing the interval
        return () => clearInterval(interval);
      }, [count]);
  
    async function submittask(){
      const { value: formValues } = await Swal.fire({
        title: "Submit Task",
        html: `
        <div class="labelcontainer">
          <label>Task</label>
          <label>Status</label>
          <label>Remarks</label>
        </div>
        <div class="inputcontainer">
          <select id="Task-Name" class="swal2-select">
          `+options+`
          </select>
          <select id="updatedstatus" class="swal2-select">
            <option value="Complete">Complete</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Partially Complete">Partially Complete</option>
            <option value="Issue">Issue</option>
            <option value="On-Leave">On-Leave</option>
          </select>
          <textarea id="Remark" class="swal2-input"></textarea>
        </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#006aff",
        cancelButtonColor: "#d33",
        confirmButtonText: "Submit Task",
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("Task-Name").value,
            document.getElementById("updatedstatus").value,
            document.getElementById("Remark").value,
          ];
        }
      })
      .then((result) => {
        if (result.isConfirmed) {
          databases
          .listDocuments('663190eb001dd2ba5a61','663190fa0031fcaadaae',[Query.equal("$id", result.value["0"])])
          .then((res)=>{
            const promise = databases.createDocument(
              '663190eb001dd2ba5a61',
              '6638adfb0018aec1717d',
              ID.unique(),
              {
                taskid:res.documents[0].$id,
                User_id : res.documents[0].user_id,
                title : res.documents[0].title,
                assigned_by : res.documents[0].assigned_by,
                Assigned_by_name: res.documents[0].Assigned_by_name,
                status: result.value["1"],
                from_status: res.documents[0].status,
                start: res.documents[0].start,
                end: res.documents[0].end,
                Description: res.documents[0].Description,
                Remarks:result.value["2"],
                Approval_Status:"Pending",
                assignee_name:res.documents[0].assignee_name,
              }
            );
            
            promise.then(function (response) {
                setnewsubmission(res)
            }, function (error) {
                console.log(error);
            });
          })
          .catch((error)=>{
            console.log(error);
            authcontext.setTasks(null);
        });
        }
      });
    }
  
    return (
      <div className='mytasks'>
  
        <div className='taskcategory'style={{justifyContent:'space-evenly'}}>
          <div className='categorybox'>
            <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} />
            <p>Pending</p>
            <h1>{Pending.length}</h1>
          </div>
          <div className='categorybox'>
            <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} />
            <p>Approved</p>
            <h1>{Approved.length}</h1>
          </div>
          <div className='categorybox'>
            <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} />
            <p>Rejected</p>
            <h1>{Rejected.length}</h1>
          </div>
        </div>
  
        <div style={{display:'flex', justifyContent:'space-between', padding:"0px 20px"}}>
        <h2 style={{paddingLeft:"10px"}}>MY SUBMISSIONS</h2>
        {tasks.length!=0 && options.length!=0 && <button style={{padding:"10px", background:"#006aff", border:"none", color:"white", borderRadius:"5px", fontWeight:"600", cursor:"pointer"}} onClick={(e)=>{
          e.preventDefault()
          submittask()
        }}>Submit Task</button>}
        {/* {tasks.length==0 && <div style={{display:'flex'}}></div>} */}
        </div>
  
        <table>
            <tr className='tablehead'>
            <th>Title</th>
            <th>Assigned By</th>
            <th>Current Status</th>
            <th>Updated Status</th>
            <th>Approval Status</th>
            </tr>
          <tbody>
          {Submissions.map((task) => {
            return <tr key={task.id}>
            <td><p>{task.title}</p></td>
            <td><p>{task.Assigned_by_name}</p></td>
            <td><p>{task.from_status=="Not Started" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.from_status=="Complete" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.from_status=="Incomplete" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> }{task.from_status=="Partially Complete" && <FontAwesomeIcon icon={faCircleHalfStroke} style={{color: "#FFD43B",}} /> }{task.from_status=="Issue" && <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#B197FC",}} /> }{task.from_status=="On-Leave" && <FontAwesomeIcon icon={faMugHot} style={{color: "grey",}} /> } {task.from_status}</p></td>
            <td><p>{task.status=="Not Started" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.status=="Complete" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.status=="Incomplete" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> }{task.status=="Partially Complete" && <FontAwesomeIcon icon={faCircleHalfStroke} style={{color: "#FFD43B",}} /> }{task.status=="Issue" && <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#B197FC",}} /> }{task.status=="On-Leave" && <FontAwesomeIcon icon={faMugHot} style={{color: "grey",}} /> } {task.status}</p></td>
            <td><p>{task.Approval_Status=="Pending" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.Approval_Status=="Approved" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.Approval_Status=="Rejected" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> } {task.Approval_Status}</p></td>
            </tr>
            })} 
          </tbody>  
        </table>
      </div>
    )
  }

export default SubmitTask