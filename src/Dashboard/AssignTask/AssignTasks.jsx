import React, { useContext, useEffect, useState } from 'react'
import { account, databases } from '../../lib/appwrite';
import { ID, Query } from 'appwrite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';

function AssignTasks() {

  const [tasks, setTasks] = useState([]);
  tasks.sort((a,b)=>new Date(b.end).valueOf() - new Date(a.end).valueOf() );
  let user = JSON.parse(localStorage.getItem("user"));
  const [options, setoptions] = useState([]);
  const [newtask, setnewtask] = useState([]);
  let [role, setrole] = useState("TL")

  let NotStarted = tasks.filter((task)=>{
      return task.status=="Not Started"
    })
  let Complete = tasks.filter((task)=>{
      return task.status=="Complete"
    })
  let Incomplete = tasks.filter((task)=>{
      return task.status=="Incomplete"
    })
  let PartiallyComplete = tasks.filter((task)=>{
      return task.status=="Partially Complete"
    })
  let Issue = tasks.filter((task)=>{
      return task.status=="Issue"
    })

  const [count, setCount] = useState(0);

  useEffect(()=>{
    databases
        .listDocuments('663190eb001dd2ba5a61','663763e6000b018d456e',[Query.equal("$id", user.$id)])
        .then((res)=>{
           setrole(res.documents[0].Roles[0]);
        })
        .catch((err)=>{
            console.error(err)
        })
  })

  useEffect(()=>{
      let optionarray = []
      databases
      .listDocuments('663190eb001dd2ba5a61','663763e6000b018d456e')
      .then((res)=>{
        for(let key in res.documents){
          if(res.documents[key].Userid!=user.$id){
            if(role=="PM"){
            optionarray.push("<option value="+res.documents[key].Userid+">"+res.documents[key].User_name+"</option>")
            }
            if(role=="TL"){
              if(res.documents[key].Roles[0]!="PM"){
              optionarray.push("<option value="+res.documents[key].Userid+">"+res.documents[key].User_name+"</option>")
              }
                }
          }
        }
        setoptions(optionarray)
      })
      .catch((error)=>{
        console.log(error);
    });
    
    databases
      .listDocuments('663190eb001dd2ba5a61','663190fa0031fcaadaae', [Query.equal("assigned_by", user.$id)])
      .then((res)=>{
        setTasks(res.documents)
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

  async function submitaddtask(){
    const { value: formValues } = await Swal.fire({
      title: "Submit Task",
      html: `
      <div class="labelcontainer">
        <label>Task Title</label>
        <label>Assigned to</label>
        <label>start</label>
        <label>end</label>
        <label>Description</label>
      </div>
      <div class="inputcontainer">
      <input type="text" id="title" class="swal2-input"></input>
      <select id="User_id" class="swal2-select">
      `+options+`
      </select>
        <input type="date" id="start" class="swal2-input"></input>
        <input type="date" id="end" class="swal2-input"></input>
        <textarea id="desc" class="swal2-input"></textarea>
      </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#006aff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Submit Task",
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("title").value,
          document.getElementById("User_id").value,
          document.getElementById("start").value,
          document.getElementById("end").value,
          document.getElementById("desc").value,
        ];
      }
    })
    .then((result) => {
      if (result.isConfirmed) {
        // console.log(result.value["0"]+" "+result.value["1"]+" "+result.value["2"]+" "+result.value["3"]+result.value["4"])
        databases
      .listDocuments('663190eb001dd2ba5a61','663763e6000b018d456e', [Query.equal("Userid", result.value[1])])
      .then((res)=>{
        assigntask(res.documents[0].User_name, result.value[1], result.value[0], result.value[2], result.value[3], result.value[4])
      })
      .catch((error)=>{
        console.log(error);
    })
      }
    });
  }


  function assigntask(username, user_id, title, start, end, desc){
    const promise = databases.createDocument(
      '663190eb001dd2ba5a61',
      '663190fa0031fcaadaae',
      ID.unique(),
      {
        user_id : user_id,
        title : title,
        assignee_name:username,
        assigned_by : user!=""?user.$id:"",
        Assigned_by_name: user!=""?user.name:"",
        status: "Not Started",
        start: start,
        end: end,
        Description: desc,
      }
    );
    
    promise.then(function (response) {
        setnewtask(response)
    }, function (error) {
        console.log(error);
    });
  }

  function onselectevent(e){
    const start = new Date(e.start);
    const end = new Date(e.end);
    Swal.fire({
      title: e.title,
      html: `
        <div class="labelcontainer">
          <b>Status</b>
          <b>Assigned To</b>
          <b>Start</b>
          <b>End</b>
          <b class="desc">description</b>
        </div>
        
        <div class="inputcontainer">
          <p>:  `+e.status+`</p>
          <p>:  `+e.assignee_name+`</p>
          <p>:  `+ start.toDateString() +`</p>
          <p>:  `+ end.toDateString() +`</p>
          <p class="desc">:  `+e.Description+`</p>
        </div>`,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    });
  }

  return (
    <div className='mytasks'>
      <div className='taskcategory'>
        <div className='categorybox'>
        <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} />
        <p>Not Started</p>
        <h1>{NotStarted.length}</h1>
        </div>
        <div className='categorybox'>
        <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} />
        <p>Complete</p>
        <h1>{Complete.length}</h1>
        </div>
        <div className='categorybox'>
        <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} />
        <p>Incomplete</p>
        <h1>{Incomplete.length}</h1>
        </div>
        <div className='categorybox'>
        <FontAwesomeIcon icon={faCircleHalfStroke} style={{color: "#FFD43B",}} />
        <p>Partially Complete</p>
        <h1>{PartiallyComplete.length}</h1>
        </div>
        <div className='categorybox'>
        <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#B197FC",}} />
        <p>Issue</p>
        <h1>{Issue.length}</h1>
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', padding:"0px 20px"}}>
        <h2 style={{paddingLeft:"10px"}}>ASSIGNED TASKS</h2>
        <button style={{padding:"10px", background:"#006aff", border:"none", color:"white", borderRadius:"5px", fontWeight:"600", cursor:"pointer"}} onClick={(e)=>{
          e.preventDefault()
          submitaddtask()
        }}>Assign Task</button>
        </div>

      <table>
          <tr className='tablehead'>
            <th>Assigned to</th>
          <th>Title</th>
          <th>Status</th>
          <th>Start</th>
          <th>End</th>
          </tr>
        <tbody>
        {tasks.map((task) => {
          const start = new Date(task.start);
          const end = new Date(task.end);
          return <tr key={task.id} onClick={(e)=>{
            e.preventDefault();
          onselectevent(task)}}>
          <td><p>{task.assignee_name}</p></td>
          <td><p>{task.title}</p></td>
          <td><p>{task.status=="Not Started" && <FontAwesomeIcon icon={faCirclePlay} style={{color: "#74C0FC",}} /> }{task.status=="Complete" && <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} /> }{task.status=="Incomplete" && <FontAwesomeIcon icon={faCircleXmark} style={{color: "red",}} /> }{task.status=="Partially Complete" && <FontAwesomeIcon icon={faCircleHalfStroke} style={{color: "#FFD43B",}} /> }{task.status=="Issue" && <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#B197FC",}} /> }{task.status=="On-Leave" && <FontAwesomeIcon icon={faMugHot} style={{color: "grey",}} /> } {task.status}</p></td>
          <td><p>{start.toDateString()}</p></td>
          <td><p>{end.toDateString()}</p></td>
          </tr>
          })} 
        </tbody>  
      </table>
    </div>
  )
}

export default AssignTasks