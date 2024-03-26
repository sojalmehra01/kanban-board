import React, { useState } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
// import { GoogleLogin } from '@react-oauth/google'; // Corrected import statement

const Login = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
 };

//  const responseGoogle = (response) => {
//     console.log(response);
//     // Handle Google login response here
//  };

 return (
    <Grid container spacing={2} style={{  padding: '20px' }}>
      <Grid item xs={12}>
        <Typography variant="h4" style={{ color: '#6A1B9A' }}>Login</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ backgroundColor: '#FFF', color: '#000' }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ backgroundColor: '#FFF', color: '#000' }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Login
        </Button>
      </Grid>
      <Grid item xs={12}>
        {/* <GoogleLogin
          clientId="YOUR_CLIENT_ID"
          buttonText="Sign in with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        /> */}
      </Grid>
    </Grid>
 );
};

export default Login;