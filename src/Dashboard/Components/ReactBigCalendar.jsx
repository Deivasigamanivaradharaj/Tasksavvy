import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Swal from "sweetalert2";
import { databases} from "../../lib/appwrite";
import { Query } from "appwrite";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const styles = ".rbc-event{background:blue;border-radius:5px;text-align:center}";

export default function ReactBigCalendar() {
  const [eventsData, setEventsData] = useState([]);
  const [count, setCount] = useState(0);
  let user = JSON.parse(localStorage.getItem("user")) 
  
  // useEffect(()=>{
  //     let user = JSON.parse(localStorage.getItem("user")) 
  //     databases
  //       .listDocuments('663190eb001dd2ba5a61','663190fa0031fcaadaae',[Query.equal("user_id", user.$id)])
  //       .then((res)=>{
  //         localStorage.setItem("tasks", JSON.stringify(res));
  //       })
  //       .catch((error)=>{
  //         console.log(error);
  //     });
  //     const interval = setInterval(() => {
  //       setCount(count + 1);
  //       }, 1000);
  
  //       //Clearing the interval
  //       return () => clearInterval(interval);
  //     }, [count]);

  useEffect(()=>{
    let events = []
    databases
      .listDocuments('663190eb001dd2ba5a61','663190fa0031fcaadaae',[Query.equal("user_id", user.$id)])
      .then((res)=>{
        localStorage.setItem("tasks", JSON.stringify(res));
        for(let key in res.documents){
          events.push({...res.documents[key], id:key})
        }
        setEventsData(events)
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

  function onselectevent(e){
    const start = new Date(e.start);
    const end = new Date(e.end);
    Swal.fire({
      title: e.title,
      html: `
        <div class="labelcontainer">
          <p>Status</p>
          <p>Assigned by</p>
          <p>Assigned-To</p>
          <p>Assigned-By</p>
          <p>Desctiption</p>
        </div>
        
        <div class="inputcontainer">
          <p>:  `+e.status+`</p>
          <p>:  `+e.Assigned_by_name+`</p>
          <p>:  `+ start.toDateString() +`</p>
          <p>:  `+ end.toDateString() +`</p>
          <p>:  `+e.Description+`</p>
        </div>`,
    })
  }

  const components = {
    event:(props)=>{
      const eventType = props?.event?.status
      switch(eventType){
        case "Not Started":
          return(
            <div style={{background:"blue", color: "white", padding:"3px 10px", borderRadius:"5px", fontWeight:"600"}}>
              {props.title}
            </div>
          );
        case "Incomplete":
          return(
            <div style={{background:"red", color: "white", padding:"3px 10px", borderRadius:"5px", fontWeight:"600"}}>
              {props.title}
            </div>
          );
        case "Partially Complete":
          return(
            <div style={{background:"Orange", color: "white", padding:"3px 10px", borderRadius:"5px", fontWeight:"600"}}>
              {props.title}
            </div>
          );
        case "Complete":
          return(
            <div style={{background:"lightgreen", color: "black", padding:"3px 10px", borderRadius:"5px", fontWeight:"600"}}>
              {props.title}
            </div>
          );
        case "Issue":
          return(
            <div style={{background:"purple", color: "white", padding:"3px 10px", borderRadius:"5px", fontWeight:"600"}}>
              {props.title}
            </div>
          );
        case "On-Leave":
          return(
            <div style={{background:"grey", color: "white", padding:"3px 10px", borderRadius:"5px", fontWeight:"600"}}>
              {props.title}
            </div>
          );
        default:
          return(<div>
            {props.title}
          </div>)
      }
    }
  }

  return (
    <div className="App">
      <style>
        {styles}
      </style>
      <Calendar
      components={components}
        views={["agenda", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: "100vh" }}
        onSelectEvent={(e)=>{onselectevent(e)}}
      />
    </div>
  );
}
