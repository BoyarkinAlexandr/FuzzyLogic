import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { PlayCircleOutline } from '@mui/icons-material';
import axios from 'axios';

const Graphs = () => {
  const [states, setStates] = useState(['q0', 'q1', 'q2', 'q3', 'q4', 'q5']);
  const [transitions, setTransitions] = useState({});
  const [loading, setLoading] = useState(false);
  const [graphImage, setGraphImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTheoryDialog, setOpenTheoryDialog] = useState(false); // Теория диалог
  const [openVideoDialog, setOpenVideoDialog] = useState(false);

  const handleTransitionChange = (fromState, toState, value) => {
    setTransitions(prev => ({
      ...prev,
      [`${fromState}-${toState}`]: value,
    }));
  };

  const handleSubmitTable = async () => {
    if (Object.values(transitions).every(value => value === '')) {
      alert('Пожалуйста, заполните хотя бы один переход.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/graphs/generate_transition_graph/',
        { transitions: transitions },
        { responseType: 'blob' }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setGraphImage(imageUrl);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert('Не удалось сгенерировать граф. Проверьте введенные данные и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Grid container justifyContent="space-between">
        <Button variant="outlined" color="primary" onClick={() => setOpenDialog(true)}>
          Описание
        </Button>
        <Button variant="outlined" color="primary" onClick={() => setOpenTheoryDialog(true)}>
          Теория
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenVideoDialog(true)}
          startIcon={<PlayCircleOutline />}
        >
          Видео
        </Button>
      </Grid>

      <Typography variant="h6" sx={{ marginTop: 2 }}>Введите переходы состояний:</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {states.map((state) => (
                    <TableCell key={state} align="center">{state}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {states.map((fromState) => (
                  <TableRow key={fromState}>
                    <TableCell align="center">{fromState}</TableCell>
                    {states.map((toState) => (
                      <TableCell key={toState} align="center">
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={transitions[`${fromState}-${toState}`] || ''}
                          onChange={(e) => handleTransitionChange(fromState, toState, e.target.value)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTheoryDialog} onClose={() => setOpenTheoryDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Теория составления графов переходов</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Граф переходов, или граф состояний, математически представляется в виде ориентированного графа G = (V, E), где:
          </Typography>
          <Typography variant="body1" paragraph>
            1. V — конечное множество вершин (состояний).
          </Typography>
          <Typography variant="body1" paragraph>
            2. E — множество ориентированных рёбер (переходов).
          </Typography>
          <Typography variant="body1" paragraph>
            Каждый переход между состояниями описывается в виде ребра (u, v), где u, v — вершины графа. Метки на рёбрах обозначают условия переходов.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTheoryDialog(false)} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Graphs;
