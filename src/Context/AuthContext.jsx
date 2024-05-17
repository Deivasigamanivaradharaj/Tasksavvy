import React, { createContext, useState } from 'react'

const AuthContext = createContext({
  user:null,
  tasks:null,
  setUser:undefined,
  setTasks:undefined,
})

export function AuthContextProvider(props) {

    let [user, setUser] = useState(null);
    let [tasks, setTasks] = useState(null);

  return (
    <AuthContext.Provider value={{
      user:user,
      tasks:tasks,
      setUser:setUser,
      setTasks:setTasks
    }}>
        {props.children}
    </AuthContext.Provider>
  )
}   

export default AuthContext


