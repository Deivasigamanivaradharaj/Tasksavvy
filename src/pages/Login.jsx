import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account, databases } from "../lib/appwrite";
import { Query } from "appwrite";

const Login = () => {

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    account
      .createEmailSession(formData.get("email"), formData.get("password"))
      .then((res) => {
        console.log(res)
        localStorage.setItem("activelink", "1");
          account
            .get()
            .then((res) => {
              localStorage.setItem("user", JSON.stringify(res));
              databases
              .listDocuments('663190eb001dd2ba5a61','663763e6000b018d456e',[Query.equal("$id", res.$id)])
              .then((res)=>{
                // setrole(res.documents[0].Roles[0]);
                localStorage.setItem("role", res.documents[0].Roles[0]);
                navigate("/home");
              })
              .catch((err)=>{
                  console.error(err)
              })
            })
            .catch((err) => {
              console.log(err);
            });
      })
      .catch((err) => {
        if(err.code==400 || (err.code==401 && err.message == "Invalid credentials. Please check the email and password.")){
          setError("Invalid Email or Password!");
        }
        else if(err.code==429){
          setError("Wrong Password Entered too many times! Try after some time.");
        }
        else if(err.code==401){
          account
          .deleteSession('current')
          .then((res) => {
            handleLogin(e)
          })
          .catch((err) => {
            console.log(err.code);
            console.log(err.message);
          })
        }
        else{
          setError(err.message);
        }
        console.log(err.code)
      })
  };

  return (
    <div className="LoginContainer">
      <form onSubmit={handleLogin} className="form">
        <h1>Login</h1>
        <label>Email</label>
        <input
        name="email"
          type="email"
          placeholder="Enter Email"
          onChange={(e)=>{
            e.preventDefault()
            setError(null)
          }}
          required
        />
        <br />
        <label>Password</label>
        <input
        name="password"
          type="password"
          placeholder="Enter Password"
          onChange={(e)=>{
            e.preventDefault()
            setError(null)
          }}
          required
        />
        <br />
        <Link to={"/forgotpassword"}>Forgot Password?</Link>
        <br />
        {error && <div className="error-msg" style={{color:"red"}}>{error}</div>}
        <br />
        <input style={{cursor:"pointer"}} type="submit" className="submit-btn" value="LOGIN"></input>
      </form>
    </div>
  );
};

export default Login;
