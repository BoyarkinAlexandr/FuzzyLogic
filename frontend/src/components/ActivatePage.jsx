import React, { useState } from 'react';
import { BiUserCheck } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Typography, Container, Box, CircularProgress } from '@mui/material';

const ActivatePage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Здесь вы можете сделать запрос на сервер для активации аккаунта
      // Например, с помощью fetch или axios
      // await activateAccount({ uid, token });

      setIsSuccess(true);
      toast.success('Ваш аккаунт был активирован! Вы можете войти!',  { autoClose: 2000 });
      navigate('/login');
    } catch (error) {
      setIsError(true);
      toast.error('Активация не успешна. Пожалуйста попробуйте ещё раз', { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Активировать аккаунт <BiUserCheck />
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && (
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
