import { ID, Query } from 'appwrite';
import React, { useEffect, useState } from 'react'
import { account, databases } from '../../lib/appwrite';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ManageMembers() {
  let [users, setusers] = useState([]);
  let [newuser, setnewuser] = useState([])
  const navigate = useNavigate();

  useEffect(()=>{
    let userlist = []
    databases
      .listDocuments('663190eb001dd2ba5a61','663763e6000b018d456e')
      .then((res)=>{
        localStorage.setItem("users", JSON.stringify(res));
        for(let key in res.documents){
          userlist.push({...res.documents[key], id:key})
        }
        setusers(userlist)
      })
      .catch((error)=>{
        console.log(error);
    });
  }, [newuser])

  const handleaddmember = async (e) => {
    e.preventDefault();
    const { value: formValues } = await Swal.fire({
      title: "Add Member",
      html: `
      <div class="labelcontainer">
        <label>Name</label>
        <label>Email</label>
        <label>Phone</label>
        <label>Role</label>
      </div>
      <div class="inputcontainer">
        <input type="text" id="name" class="swal2-input"></input>
        <input type="email" id="email" class="swal2-input"></input>
        <input type="number" id="phone" class="swal2-input"></input>
        <select id="role" class="swal2-select">
            <option value="TM">Team Member</option>
            <option value="TL">Team Lead</option>
            <option value="PM">Project Manager</option>
          </select>
      </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#006aff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add",
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("name").value,
          document.getElementById("email").value,
          document.getElementById("phone").value,
          document.getElementById("role").value,
        ];
      }
    })
    .then((result) => {
      if (result.isConfirmed) {
          const userId = ID.unique();
          account.create(
            userId, 
            result.value[1],
            "Oneyes@123",
            result.value[0]
          )
          .then((res)=>{
            databases.createDocument(
              '663190eb001dd2ba5a61',
              '663763e6000b018d456e',
              res.$id,
              {
                Userid:res.$id,
                User_name:res.name,
                User_Email:res.email,
                User_phone:result.value[2],
                Roles:[result.value[3]]
              }
            )
            .then((response)=>{
                setnewuser(response);
            })
            .catch((error)=>{
                console.log(error);
            });
          })
          .catch ((error)=>{
            console.error(error);
          })
      }});
  };

  function onselectevent(e){
    navigate("./Profile?userid="+e.$id)
  }

  // function onselectevent(e){
  //   let role = "";
  //   if(e.Roles[0] == "TM"){
  //     role = "Team Member"
  //   }
  //   if(e.Roles[0] == "TL"){
  //     role = "Team Lead"
  //   }
  //   if(e.Roles[0] == "PM"){
  //     role = "Project Manager"
  //   }
  //   console.log(role)
  //   Swal.fire({
  //     title: e.User_name,
  //     html: `
  //       <div class="labelcontainer">
  //         <b>Name</b>
  //         <b>Email</b>
  //         <b>Phone</b>
  //         <b>Role</b>
  //       </div>
        
  //       <div class="inputcontainer">
  //         <p>:  `+e.User_name+`</p>
  //         <p>:  `+e.User_Email+`</p>
  //         <p>:  `+e.User_phone+`</p>
  //         <p>:  `+role+`</p>
  //       </div>`,
  //     showClass: {
  //       popup: `
  //         animate__animated
  //         animate__fadeInUp
  //         animate__faster
  //       `
  //     },
  //     hideClass: {
  //       popup: `
  //         animate__animated
  //         animate__fadeOutDown
  //         animate__faster
  //       `
  //     }
  //   });
  // }

  return (
    <>
  
        <div style={{display:'flex', justifyContent:'space-between', padding:"0px 20px"}}>
        <h2 style={{paddingLeft:"10px"}}>Members</h2>
        <button style={{padding:"10px", background:"#006aff", border:"none", color:"white", borderRadius:"5px", fontWeight:"600", cursor:"pointer"}} onClick={(e)=>{
          e.preventDefault()
          handleaddmember(e)
        }}>Add Member</button>
        </div>
  
        <table>
            <tr className='tablehead'>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            </tr>
          <tbody>
          {users.map((user) => {
            let role = "";
            if(user.Roles[0] == "TM"){
              role = "Team Member"
            }
            if(user.Roles[0] == "TL"){
              role = "Team Lead"
            }
            if(user.Roles[0] == "PM"){
              role = "Project Manager"
            }
            return <tr style={{cursor:"pointer"}} key={user.id}  onClick={(e)=>{
              e.preventDefault();
            onselectevent(user)}}>
            <td><p>{user.User_name}</p></td>
            <td><p>{user.User_Email}</p></td>
            <td><p>{user.User_phone}</p></td>
            <td><p>{role}</p></td>
            </tr>
            })} 
          </tbody>  
        </table>
      </>
  )
}

export default ManageMembers