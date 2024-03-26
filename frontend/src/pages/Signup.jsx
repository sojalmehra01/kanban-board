import React, { useState } from 'react';
import { supabase } from '../Supabaseclient';

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
    <div className="login_form">
      <form action=""onSubmit={handleSignup}>
        <input name ="fullname" placeholder='Full Name' onChange={handleChange}/>

        <input name='email' placeholder='email' onChange={handleChange}/>

        <input name='password' type="password" placeholder='password' onChange={handleChange} />
         
        <button type="submit">
          Submit
          </button>  

      </form>
    </div>
 );
};

export default Signup;