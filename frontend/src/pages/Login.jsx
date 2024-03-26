import React, { useState } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
import supabase from './supabaseClient'; // Import the Supabase client

const Login = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signIn({ email, password });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('Logged in successfully!');
    }
    setLoading(false);
 };

 return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
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
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          Login
        </Button>
      </Grid>
    </Grid>
 );
};

export default Login;
