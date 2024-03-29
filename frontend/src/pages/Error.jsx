import React from 'react'
import { Link } from 'react-router-dom'
import './error.css'

const Error = () => {
  return (
    <div className='error-page'>
        <h1>ERROR 404</h1>
        <p className='not-found'>Page not Found</p>
        <p>Try logging in again <Link to='/login'>Login</Link></p>
    </div>
  )
}

export default Error
