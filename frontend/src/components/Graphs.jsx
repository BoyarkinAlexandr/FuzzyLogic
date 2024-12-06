import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const Graphs = () => {
  const [states, setStates] = useState(['q0', 'q1', 'q2', 'q3', 'q4', 'q5']);
  const [transitions, setTransitions] = useState({});
  const [loading, setLoading] = useState(false);
  const [graphImage, setGraphImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);  // Стейт для открытия диалога с описанием
  const [openVideoDialog, setOpenVideoDialog] = useState(false);  // Стейт для открытия диалога с видео

  const handleTransitionChange = (fromState, toState, value) => {
    setTransitions(prev => ({
      ...prev,
      [`${fromState}-${toState}`]: value,
    }));
  };

  const handleSubmitTable = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/generate_transition_graph/', {
        transitions: transitions,
      });

      // Сохраняем полученное изображение графа
      const imageUrl = URL.createObjectURL(response.data);
      setGraphImage(imageUrl);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenVideoDialog = () => {
    setOpenVideoDialog(true);
  };

  const handleCloseVideoDialog = () => {
    setOpenVideoDialog(false);
  };

  return (
    <div>
      <Grid container justifyContent="space-between">
        {/* Кнопка открытия описания */}
        <Button variant="outlined" color="primary" onClick={handleOpenDialog}>
          Описание
        </Button>

        {/* Кнопка открытия видео */}
        <Button variant="outlined" color="primary" onClick={handleOpenVideoDialog}>
          Видео
        </Button>
      </Grid>

      <Typography variant="h6" sx={{ marginTop: 2 }}>Введите переходы состояний:</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Таблица переходов:</Typography>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th></th>
                  {states.map((state) => (
                    <th key={state}>{state}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {states.map((fromState) => (
                  <tr key={fromState}>
                    <td>{fromState}</td>
                    {states.map((toState) => (
                      <td key={toState}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={transitions[`${fromState}-${toState}`] || ''}
                          onChange={(e) => handleTransitionChange(fromState, toState, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitTable}
        sx={{ marginTop: 3 }}
      >
        Составить граф переходов
      </Button>

      {loading && <CircularProgress sx={{ marginTop: 2 }} />}
      
      {graphImage && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Граф переходов:</Typography>
          <img src={graphImage} alt="Graph of transitions" style={{ maxWidth: '100%' }} />
          
          {/* Ссылка на видео */}
          <Box sx={{ marginTop: 1 }}>
            <Typography variant="body1">
              Вы можете посмотреть видео о создании графов переходов по следующей ссылке:
            </Typography>
            <a href="https://www.youtube.com/watch?v=kJDx5R1TxIM" target="_blank" rel="noopener noreferrer">
              Перейти к видео
            </a>
          </Box>
        </Box>
      )}

      {/* Диалоговое окно с описанием */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Описание метода</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Этот метод позволяет визуализировать переходы между состояниями в виде графа.
          </Typography>
          <Typography variant="body1" paragraph>
            1. Введите переходы между состояниями в таблице. Каждый переход должен быть описан событием.
          </Typography>
          <Typography variant="body1" paragraph>
            2. После заполнения таблицы нажмите кнопку "Составить граф переходов". Приложение автоматически сгенерирует граф переходов и отобразит его на экране.
          </Typography>
          <Typography variant="body1" paragraph>
            3. Граф отображает состояния и переходы между ними, что помогает визуализировать алгоритм или процесс.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалоговое окно с видео из ВКонтакте */}
      <Dialog open={openVideoDialog} onClose={handleCloseVideoDialog} maxWidth="md" fullWidth>
        <DialogTitle>Посмотреть видео</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <iframe src="https://vk.com/video_ext.php?oid=-219252372&id=456240192&hd=2&autoplay=1" width="853" height="480" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideoDialog} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Graphs;
