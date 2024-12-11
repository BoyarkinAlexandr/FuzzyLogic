import React, { useState, useEffect } from 'react';
import { BiUserCheck } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { activate, reset } from '../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography, Container, Box, CircularProgress } from '@mui/material';

const ActivatePage = () => {
  const { uid, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(activate({ uid, token }));
  };

  // Redirect to home page after successful activation
  useEffect(() => {
    if (isSuccess) {
      toast.success("Ваш аккаунт был активирован! Вы можете войти!");
      navigate('/login'); // Redirect to home page
    }

    if (isError) {
      toast.error(message || 'Что-то пошло не так.');
    }
    dispatch(reset())
  }, [isSuccess, isError, navigate, message]);
  
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Активировать аккаунт <BiUserCheck />
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{ marginTop: 3 }}
        >
          Активировать
        </Button>
      )}
    </Container>
  );
};

export default ActivatePage;
