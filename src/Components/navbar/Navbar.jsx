import React from 'react'
import "./navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="title">
        <h1>Kanban Board</h1>
      </div>
      <div className="nav_btn">
        <Link className='link_btn' to={"/home"}>home</Link>
        <Link className='link_btn' to={"/home"}>home</Link>
        <Link className='link_btn' to={"/home"}>home</Link>
        <Link className='link_btn' to={"/home"}>home</Link>
        <Link className='link_btn' to={"/home"}>home</Link>
        <div className="user"></div>
    </div>
      </div>
      
  )
}

export default Navbar
