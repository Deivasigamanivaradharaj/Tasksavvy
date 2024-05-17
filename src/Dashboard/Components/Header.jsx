import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../lib/appwrite";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import AuthContext from "../../Context/AuthContext";

function Header() {

  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user"));
  const [logoutErr, setLogoutErr] = useState(null);

  const handleLogout = () => {
    setLogoutErr(null);
    account
      .deleteSession('current')
      .then((res) => {
        localStorage.clear()
        navigate("/")
      })
      .catch((err) => {
        setLogoutErr(err.message);
      })
  };

  return (
    <div className="Header">
      <h2>Welcome <span style={{color:"blue"}}>{user!=null?user.name:""}</span></h2>
      <button
        type="button"
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
  </div>
  )
}

export default Header