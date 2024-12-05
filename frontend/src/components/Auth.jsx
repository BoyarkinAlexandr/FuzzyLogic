import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Auth() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/users/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert('Registration successful');
    } else {
      alert('Error during registration');
    }
  };

  return (
    <Box sx={{ width: 300, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
}
