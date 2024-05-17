import React, { useEffect, useState } from 'react'
import { account } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [error, setError] = useState(null);
    const [success, setsuccess] = useState(null);

    const navigate = useNavigate();

    const forgotpassword = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        account
        .createRecovery
        (
            formData.get("email"),
             'https://tasksavvy.netlify.app/resetpassword'
            )
        .then((res)=>{
            setsuccess("Check Your Email for Password Reset Link")
            setTimeout(()=>{
                navigate("../");
            },3000)
        })
        .catch((error)=>{
            setError(error.message);
        });
      }

    
  return (
    <div className="LoginContainer">
      <form onSubmit={forgotpassword} className="form">
        <h1>Forgot Password</h1>
        <label>Email</label>
        <input
        name="email"
        type="email"
        placeholder="Enter your Email"
        onChange={(e)=>{
            e.preventDefault()
            setError(null)
        }}
        required
        />
        <br />
        {error && <div className="error-msg" style={{color:'red'}}>{error}</div>}
        {success && <div className="error-msg" style={{color:'green'}}>{success}</div>}
        <br />
        <input style={{cursor:"pointer"}} type="submit" className="submit-btn" value="Reset Password"></input>
      </form>
    </div>
  )
}

export default ForgotPassword