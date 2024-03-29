import React, { useState  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../Supabaseclient';
import './login.css'

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
    <div className="login_form_box">


      <form className={'login_form'}onSubmit={handleLogin}>
        <h1 className='login_title'>Login.</h1>

        <p className='new_here'>New to this website? <Link to={'/signup'}>Signup</Link></p>

        <input autoComplete='off' name='email' placeholder='Email' onChange={handleChange}/>
        <label className='form__label' htmlFor="email">Email <span className="material-symbols-outlined">
mail
</span></label>

        <input name='password' type="password" placeholder='password' onChange={handleChange} />
        <label className='form__label' htmlFor="email">Password<span className="material-symbols-outlined">
lock
</span></label>
         
        <button type="submit">
          Submit
          </button>  

      </form>
    </div>
 );
};

export default Login;