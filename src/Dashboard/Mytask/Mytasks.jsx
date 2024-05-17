import React, { useContext, useEffect, useState } from 'react'
import { account, databases } from '../../lib/appwrite';
import { ID, Query } from 'appwrite';
import AuthContext from '../../Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';

function Mytasks() {

  const [tasks, setTasks] = useState([]);
  tasks.sort((a,b)=>new Date(b.end).valueOf() - new Date(a.end).valueOf() );
  let user = JSON.parse(localStorage.getItem("user"));
  let [NotStarted, setNotStarted] = useState([])
  let [Complete, setComplete] = useState([])
  let [Incomplete, setIncomplete] = useState([])
  let [PartiallyComplete, setPartiallyComplete] = useState([])
  let [Issue, setIssue] = useState([])
  const [count, setCount] = useState(0);
  
  useEffect(()=>{
      let user = JSON.parse(localStorage.getItem("user")) 
      let events = []
      databases
        .listDocuments('663190eb001dd2ba5a61','663190fa0031fcaadaae',[Query.equal("user_id", user.$id)])
        .then((res)=>{
          localStorage.setItem("tasks", JSON.stringify(res));
          for(let key in res.documents){
            events.push({...res.documents[key], id:key})
          }
          setTasks(events)
          // for(let key in res.documents){
          //   if(res.documents[key].status=="Not Started"){
          //     setNotStarted((NotStarted) => NotStarted+1)
          //   }
          //   if(res.documents[key].status=="Complete"){
          //     setComplete((Complete) => Complete+1)
          //   }
          //   if(res.documents[key].status=="Incomplete"){
          //     setIncomplete((Incomplete) => Incomplete+1);
          //   }
          //   if(res.documents[key].status=="Partially Complete"){
          //     setPartiallyComplete((PartiallyComplete) => PartiallyComplete+1);
          //   }
          //   if(res.documents[key].status=="Issue"){
          //     setIssue((Issue) => Issue+1);
          //   }
            
          // }
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

      useEffect(()=>{
        setNotStarted(tasks.filter((task)=>{
          return task.status=="Not Started"
        }))
        setComplete(tasks.filter((task)=>{
          return task.status=="Complete"
        }))
        setIncomplete(tasks.filter((task)=>{
          return task.status=="Incomplete"
        }))
        setPartiallyComplete(tasks.filter((task)=>{
          return task.status=="Partially Complete"
        }))
        setIssue(tasks.filter((task)=>{
          return task.status=="Issue"
        }))
      },[tasks])


  function onselectevent(e){
    const start = new Date(e.start);
    const end = new Date(e.end);
    Swal.fire({
      title: e.title,
      html: `
        <div class="labelcontainer">
          <b>Status</b>
          <b>Assigned By</b>
          <b>Start</b>
          <b>End</b>
          <b class="desc">description</b>
        </div>
        
        <div class="inputcontainer">
          <p>:  `+e.status+`</p>
          <p>:  `+e.Assigned_by_name+`</p>
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
      <table>
          <tr className='tablehead'>
          <th>Title</th>
          <th>Assigned By</th>
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
          <td><p>{task.title}</p></td>
          <td><p>{task.Assigned_by_name}</p></td>
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

export default Mytasks