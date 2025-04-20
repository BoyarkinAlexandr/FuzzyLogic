import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { PlayCircleOutline, Delete } from '@mui/icons-material';
import axios from 'axios';

const Graphs = () => {
  const [states, setStates] = useState(['q0', 'q1', 'q2', 'q3', 'q4', 'q5']);
  const [transitions, setTransitions] = useState({});
  const [loading, setLoading] = useState(false);
  const [graphImage, setGraphImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTheoryDialog, setOpenTheoryDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [videos, setVideos] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [openAddVideoDialog, setOpenAddVideoDialog] = useState(false);
  const topic = 'graphs'; // Тема для этой страницы
  const userInfo = useSelector((state) => state.auth.userInfo);
  // Загрузка видео с сервера при монтировании компонента
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log(`Fetching videos for topic: ${topic}`);
        const response = await axios.get(`http://localhost:8000/api/videos/${topic}/`);
        console.log('Videos fetched:', response.data);
        setVideos(response.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
        alert(`Не удалось загрузить видео с сервера: ${error.response?.data?.error || error.message}`);
      }
    };
    fetchVideos();
  }, [topic]);

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

  const handleAddVideo = async () => {
    if (newVideoUrl.trim() === '') {
      alert('Пожалуйста, введите URL видео');
      return;
    }
    
    try {
      new URL(newVideoUrl); // Проверка валидности URL
      console.log(`Adding video: ${newVideoUrl} for topic: ${topic}`);
      const response = await axios.post(`http://localhost:8000/api/videos/${topic}/add/`, { url: newVideoUrl });
      console.log('Add video response:', response.data);
      setVideos(response.data.videos || []);
      setNewVideoUrl('');
      setOpenAddVideoDialog(false);
    } catch (error) {
      console.error('Ошибка при добавлении видео:', error);
      alert(`Не удалось добавить видео: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      console.log(`Deleting video with ID: ${videoId} for topic: ${topic}`);
      const response = await axios.post(`http://localhost:8000/api/videos/${topic}/delete/`, { id: videoId });
      console.log('Delete video response:', response.data);
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Ошибка при удалении видео:', error);
      alert(`Не удалось удалить видео: ${error.response?.data?.error || error.message}`);
    }
  };

  // Function to check if the URL is a YouTube link
  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Function to check if the URL is a VK video link
  const isVkUrl = (url) => {
    return url.includes('vk.com') || url.includes('vkvideo.ru');
  };

  // Function to extract VK video ID and construct embed URL
  const getVkEmbedUrl = (url) => {
    const regex = /(?:vk\.com\/video|vkvideo\.ru\/video-)([0-9-_]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const [groupId, videoId] = match[1].split('_');
      return `https://vk.com/video_ext.php?oid=-${groupId}&id=${videoId}`;
    }
    return null;
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
          Видео ({videos.length})
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

      <Dialog open={openVideoDialog} onClose={() => setOpenVideoDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Видео</DialogTitle>
        <DialogContent>
          {videos.length === 0 ? (
            <Typography>Видео пока не добавлены</Typography>
          ) : (
            videos.map((video) => (
              <Box key={video.id} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">Видео {video.id}</Typography>
                  {isYouTubeUrl(video.url) ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}`}
                      title={`YouTube video ${video.id}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : isVkUrl(video.url) ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={getVkEmbedUrl(video.url)}
                      title={`VK video ${video.id}`}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      width="100%"
                      controls
                      onError={() => alert(`Не удалось загрузить видео ${video.id}. Проверьте URL или формат видео.`)}
                    >
                      <source src={video.url} type="video/mp4" />
                      <source src={video.url} type="video/webm" />
                      Ваш браузер не поддерживает воспроизведение видео.
                    </video>
                  )}
                </Box>
                {userInfo?.is_staff && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    Удалить
                  </Button>)}
                </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          {userInfo?.is_staff && (
          <Button onClick={() => setOpenAddVideoDialog(true)} color="primary">
            Добавить видео
          </Button>)}
          <Button onClick={() => setOpenVideoDialog(false)} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddVideoDialog} onClose={() => setOpenAddVideoDialog(false)}>
        <DialogTitle>Добавить новое видео</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL видео"
            type="url"
            fullWidth
            variant="outlined"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            placeholder="https://example.com/video.mp4, https://www.youtube.com/watch?v=video_id или https://vkvideo.ru/video-13137988_456263708"
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
            Поддерживаются прямые ссылки на видео (MP4, WebM), YouTube и VK видео.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddVideoDialog(false)}>Отмена</Button>
          <Button onClick={handleAddVideo} color="primary">Добавить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Graphs;