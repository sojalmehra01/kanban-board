import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./Components/navbar/Navbar";
import { useEffect, useState } from "react";
import Error from "./pages/Error";

function App() {
  
  const [token , setToken] = useState(false);

  if(token)
  {
    sessionStorage.setItem('token',JSON.stringify(token))
  }

  useEffect(()=>{
    if(sessionStorage.getItem(token))
    {
      let data = JSON.parse(sessionStorage.getItem(token));
      setToken(data);
    }
  },[token])
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path="*" element={<Error/>}/>
        <Route path="/login" element={<Login setToken={setToken}/>}/>
        {token?<Route path="/home" element={<Home/>}/>:''}
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
  );
}

export default App;
