import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmailVerification from "./Tests/EmailVerification";
import LoginPage from "./Tests/LoginPage";
import LoginPage2 from "./Tests/LoginPage2";
import RegisterPage from "./Tests/RegisterPage";
import RegisterPage2 from "./Tests/RegisterPage2";
import RegisterPageapi from "./Tests/RegisterPageapi";
import "./App.css";
import T from "./Tests/T"
function App() {
  return (
    <>
    <LoginPage2/>
    {/* <T/> */}
    </>
  );
}

export default App;
