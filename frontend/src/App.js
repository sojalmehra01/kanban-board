import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./Components/navbar/Navbar";
import { useEffect, useState } from "react";
import Error from "./pages/Error";

function App() {


  useEffect(() => {
    // Check for token in session storage when the component mounts
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      // If a token is found, parse it and set the state
      let data = JSON.parse(storedToken);
      setToken(data);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to update the token in both state and session storage
  const updateToken = (newToken) => {
      if (newToken) {
        sessionStorage.setItem('token', JSON.stringify(newToken));
        setToken(newToken);
      } else {
        sessionStorage.removeItem('token');
        setToken(false);
      }
  };
  
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
        <Route path="/home" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
  );
}

export default App;
