import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabaseclient';

const Login = ({setToken}) => {

    const navigate = useNavigate();
 
  const [formData, setformData]  = useState({ email:"", password:""
  })

 console.log(formData)

 const handleChange = (event)=> {
  setformData((prevFormData) =>{
    return{
      ...prevFormData, [event.target.name]:event.target.value
    }
    
  })
 }

 const handleLogin =async (e)=>{
  e.preventDefault();
  try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })
    if(error) throw error
    console.log(data);
    setToken(data);
    navigate('/home')
  } catch (error) {
    alert(error)
  }
 }

 return (
    <div className="login_form">
      <form action=""onSubmit={handleLogin}>

        <input name='email' placeholder='email' onChange={handleChange}/>

        <input name='password' type="password" placeholder='password' onChange={handleChange} />
         
        <button type="submit">
          Submit
          </button>  

      </form>
    </div>
 );
};

export default Login;