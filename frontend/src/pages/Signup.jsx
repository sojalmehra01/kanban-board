import React, { useState } from 'react';
import { supabase } from '../Supabaseclient';
import { Link} from 'react-router-dom';
import './signup.css'


const Signup = () => {
 
  const [formData, setformData]  = useState({
    fullname:"", email:"", password:""
  })

 console.log(formData)

 const handleChange = (event)=> {
  setformData((prevFormData) =>{
    return{
      ...prevFormData, [event.target.name]:event.target.value
    }
    
  })
 }

 const handleSignup =async (e)=>{
  e.preventDefault();
  try {
    const {data, error} = await supabase.auth.signUp({
      email: formData.email, 
      password: formData.password, 
      options: {
        data: {
          full_name: formData.fullname,
        }
      }
    }
    )
    if(error) throw error;
    alert('check your email for further verification')
  } catch (error) {
    alert(error)
  }
 }

 return (
    <div className="login_form_box">
      <form action=""onSubmit={handleSignup} className={'login_form'}>

      <h1 className='login_title'>Signup.</h1>

        <p className='new_here'>Already a member? <Link to={'/login'}>Login</Link></p>

        <div className="full_name">
          <div className="firstname">
          <input autoComplete='off' name ="first_name" placeholder='First Name' onChange={handleChange}/>
          <label className='form__label' htmlFor="email">First name <span class="material-symbols-outlined">mail
          </span></label>
          </div>
          <div className="lastname">
          <input autoComplete='off' name ="laset_name" placeholder='Last Name' onChange={handleChange}/>
          <label className='form__label' htmlFor="email">Last name <span class="material-symbols-outlined">mail
          </span></label>
          </div>
        </div>

        <input autoComplete='off' name='email' placeholder='email' onChange={handleChange}/>
        <label className='form__label' htmlFor="email">Email <span class="material-symbols-outlined">mail
        </span></label>

        <input name='password' type="password" placeholder='password' onChange={handleChange} />
        <label className='form__label' htmlFor="email">Password<span class="material-symbols-outlined">lock
        </span></label>
         
        <button type="submit">
          Submit
          </button>  

      </form>
    </div>
 );
};

export default Signup;