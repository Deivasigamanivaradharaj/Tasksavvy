import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from './Dashboard/Dashboard/Dashboard'
import Mytasks from './Dashboard/Mytask/Mytasks'
import Submissions from './Dashboard/Submissions/Submissions'
import Chat from './Dashboard/Chat/Chat'
import AssignTasks from "./Dashboard/AssignTask/AssignTasks";
import SubmitTask from "./Dashboard/SubmitTask/SubmitTask";
import ManageMembers from "./Dashboard/Members/ManageMembers";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MemberProfile from "./Dashboard/Members/MemberProfile";
import Members from "./Dashboard/Members/Members";

function App() {
  return (
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route exact path="" element={<Dashboard></Dashboard>}></Route>
          <Route path="mytasks" element={<Mytasks></Mytasks>}></Route>
          <Route path="submittask" element={<SubmitTask></SubmitTask>}></Route>
          <Route path="assigntasks" element={<AssignTasks></AssignTasks>}></Route>
          <Route path="submissions" element={<Submissions></Submissions>}></Route>
          <Route path="managemembers" element={<Members></Members>}>
            <Route exact path="" element={<ManageMembers></ManageMembers>}></Route>
            <Route path="profile" element={<MemberProfile></MemberProfile>}></Route>
          </Route>
          <Route path="chat" element={<Chat></Chat>}></Route>
        </Route>
        <Route path="/forgotpassword" element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path="/resetpassword" element={<ResetPassword></ResetPassword>}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
