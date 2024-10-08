import React from 'react'
import "./navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
//navbar

  return (
    <div className='navbar'>
      <div className="title">
        <h1>Kanban Board</h1>
      </div>
      <div className="nav_btn">
        <Link className='link_btn' to={"/dashboard"}>home</Link>
        <Link className='link_btn' to={"/login"}>Login</Link>
        <Link className='link_btn' to={"/signup"}>signup</Link>
        <Link onClick={()=>{localStorage.removeItem('sb-tkxtjervogiccudypfwz-auth-token')}} className='link_btn' to={"/login"}>logout</Link>
        {/* <Link className='link_btn' to={"/dashboard"}>home</Link> */}
        <div className="user"></div>
    </div>
      </div>
      
  )
}

export default Navbar
