import React, { useEffect, useState } from 'react'
import { account, databases } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';
import { Query } from 'appwrite';

function ResetPassword() {
    const [error, setError] = useState(null);
    const [success, setsuccess] = useState(null);
    const [username, setUsername] = useState(null);

    const navigate = useNavigate();

    useEffect(()=>{
        let params = new URLSearchParams(location.search);
        databases
        .listDocuments('663190eb001dd2ba5a61','663763e6000b018d456e',[Query.equal("$id", params.get('userId'))])
        .then((res)=>{
            setUsername(res.documents[0].User_name)
        })
        .catch((err)=>{
            console.error(err)
        })
    }, [])

    function changepassword(e){
        const formData = new FormData(e.target);
        if(formData.get("password")==formData.get("confirmpassword")){
        let params = new URLSearchParams(location.search);
        account.updateRecovery(
            params.get('userId'),
            params.get('secret'),
            formData.get("password"),
            formData.get("password")
        )
        .then((response)=>{
            setsuccess("Password Reset Successfull")
            setTimeout(()=>{
                navigate("../");
            },3000)
        })
        .catch((error)=>{
            setError(error.message); // Failure
            console.log(error.code)
        });
        }
        else{
            setError("Password and Confirm Password does not match")
        }
    }

  return (
    <div className="LoginContainer">
      <form onSubmit={(e)=>{
        e.preventDefault()
        changepassword(e)
        }} className="form">
        <h1>Reset Password</h1>
        <label>User Name</label>
        <input type="text" value={username} readOnly/>
        <br />
        <label>Password</label>
        <input
        name="password"
          type="password"
          placeholder="Enter Password"
          required
        />
        <br />
        <label>Confirm Password</label>
        <input
        name="confirmpassword"
          type="password"
          placeholder="Enter Confirm Password"
          required
        />
        <br />
        {error && <div className="error-msg" style={{color:'red'}}>{error}</div>}
        {success && <div className="error-msg" style={{color:'green'}}>{success}</div>}
        <br />
        <input style={{cursor:"pointer"}} type="submit" className="submit-btn" value="LOGIN"></input>
      </form>
    </div>
  )
}

export default ResetPassword