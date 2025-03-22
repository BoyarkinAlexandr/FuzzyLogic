import React, { useState, useEffect } from "react";
import axios from "axios";
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from "react-chartjs-2";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";
import { Delete } from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Импортируем react-katex для рендеринга формул
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Регистрируем все компоненты Chart.js и плагин аннотаций
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const MembershipFunction = () => {
  // Объект конфигурации параметров для каждой функции
  const parameterConfig = {
    S: ["a", "b"],
    Z: ["a", "b"],
    triangle: ["a", "b", "c"],
    trapezoidal: ["a", "b", "c", "d"],
  };

  // Описание функций
  const descriptions = {
    S: "S-функция — это плавная функция принадлежности, определяемая двумя параметрами: a и b. Она начинает расти от 0, достигает значения 1 и остается на этом уровне.",
    Z: "Z-функция — обратная S-функция. Она начинает с 1, постепенно уменьшается до 0 и остается на этом уровне.",
    triangle: "Треугольная функция принадлежности задается тремя параметрами: a, b и c. Она имеет форму треугольника, где b — вершина.",
    trapezoidal: "Трапецеидальная функция принадлежности задается четырьмя параметрами: a, b, c и d. Она имеет плоскую вершину между b и c.",
  };

  const formulas = {
    S: `
      y(x) = 
      \\left\\{
      \\begin{array}{ll}
        0, & x \\leq a \\\\
        2 \\left( \\frac{x - a}{b - a} \\right)^2, & a < x \\leq \\frac{a + b}{2} \\\\
        1 - 2 \\left( \\frac{b - x}{b - a} \\right)^2, & \\frac{a + b}{2} < x \\leq b \\\\
        1, & x > b
      \\end{array}
      \\right.
    `,
    Z: `
      y(x) = 
      \\left\\{
      \\begin{array}{ll}
        1 - 2 \\left( \\frac{x - a}{b - a} \\right)^2, & a < x \\leq \\frac{a + b}{2} \\\\
        2 \\left( \\frac{b - x}{b - a} \\right)^2, & \\frac{a + b}{2} < x \\leq b
      \\end{array}
      \\right.
    `,
    triangle: `
      y(x) = 
      \\left\\{
      \\begin{array}{ll}
        \\frac{x - a}{b - a}, & a < x \\leq b \\\\
        \\frac{c - x}{c - b}, & b < x \\leq c
      \\end{array}
      \\right.
    `,
    trapezoidal: `
      y(x) = 
      \\left\\{
      \\begin{array}{ll}
        \\frac{x - a}{b - a}, & a < x \\leq b \\\\
        1, & b < x \\leq c \\\\
        \\frac{d - x}{d - c}, & c < x \\leq d
      \\end{array}
      \\right.
    `,
  };

  const [functionType, setFunctionType] = useState("S");
  const [params, setParams] = useState({ a: 1, b: 5 });
  const [minX, setMinX] = useState(1);
  const [maxX, setMaxX] = useState(10);
  const [graphData, setGraphData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBLine, setShowBLine] = useState(true);
  const [showCLine, setShowCLine] = useState(true);

  // Состояния для видео
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [openAddVideoDialog, setOpenAddVideoDialog] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const topic = "membership";

  // Загрузка видео при монтировании компонента
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log(`Fetching videos for topic: ${topic}`);
        const response = await axios.get(`http://localhost:8000/api/videos/${topic}/`);
        console.log('Videos fetched:', response.data);
        // Фильтруем видео, у которых нет url
        const validVideos = (response.data || []).filter(video => video.url && typeof video.url === 'string');
        setVideos(validVideos);
      } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
        alert(`Не удалось загрузить видео с сервера: ${error.response?.data?.error || error.message}`);
      }
    };
    fetchVideos();
  }, [topic]);

  const handleOpenVideoDialog = () => {
    setOpenVideoDialog(true);
  };

  const handleCloseVideoDialog = () => {
    setOpenVideoDialog(false);
  };

  const handleOpenAddVideoDialog = () => {
    setOpenAddVideoDialog(true);
  };

  const handleCloseAddVideoDialog = () => {
    setOpenAddVideoDialog(false);
    setNewVideoUrl("");
  };

  const handleAddVideo = async () => {
    if (!newVideoUrl) {
      alert("Пожалуйста, введите URL видео.");
      return;
    }
  
    try {
      await axios.post(`http://localhost:8000/api/videos/${topic}/add/`, {
        url: newVideoUrl,
        topic: topic,
      });
      // Запрашиваем актуальный список видео с сервера
      const response = await axios.get(`http://localhost:8000/api/videos/${topic}/`);
      const validVideos = (response.data || []).filter(video => video.url && typeof video.url === 'string');
      setVideos(validVideos);
      handleCloseAddVideoDialog();
    } catch (error) {
      console.error('Ошибка при добавлении видео:', error);
      alert(`Не удалось добавить видео: ${error.response?.data?.error || error.message}`);
    }
  }

  const handleDeleteVideo = async (videoId) => {
    try {
      console.log(`Deleting video with ID: ${videoId} for topic: ${topic}`);
      const response = await axios.post(`http://localhost:8000/api/videos/${topic}/delete/`, { id: videoId });
      console.log('Delete video response:', response.data);
      // Фильтруем видео, у которых нет url
      const validVideos = (response.data.videos || []).filter(video => video.url && typeof video.url === 'string');
      setVideos(validVideos);
    } catch (error) {
      console.error('Ошибка при удалении видео:', error);
      alert(`Не удалось удалить видео: ${error.response?.data?.error || error.message}`);
    }
  };

  // Функции для обработки URL видео
  const isYouTubeUrl = (url) => {
    return url && typeof url === 'string' && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  const getYouTubeVideoId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const isVkUrl = (url) => {
    return url && typeof url === 'string' && (url.includes('vk.com') || url.includes('vkvideo.ru'));
  };

  const getVkEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regex = /(?:vk\.com\/video|vkvideo\.ru\/video-)([0-9-_]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const [groupId, videoId] = match[1].split('_');
      return `https://vk.com/video_ext.php?oid=-${groupId}&id=${videoId}`;
    }
    return null;
  };

  const handleFunctionTypeChange = (e) => {
    const selectedFunction = e.target.value;
    setFunctionType(selectedFunction);
    const newParams = {};
    parameterConfig[selectedFunction].forEach((param) => {
      newParams[param] = 0;
    });
    setParams(newParams);
  };

  const handleChangeParams = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setParams({ ...params, [name]: numericValue });
    }
  };

  const handleMinXChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setMinX(value);
    }
  };

  const handleMaxXChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setMaxX(value);
    }
  };

  const fetchGraphData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/membership/calculate/", {
        function_type: functionType,
        params,
        min_x: minX,
        max_x: maxX,
        num: 100,
      });
      setGraphData(response.data);
    } catch (error) {
      console.error("Error fetching graph data:", error);
      alert("Произошла ошибка при запросе данных. Пожалуйста, попробуйте снова.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Функции принадлежности</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            label="Тип функции"
            value={functionType}
            onChange={handleFunctionTypeChange}
            fullWidth
          >
            <MenuItem value="S">S-функция</MenuItem>
            <MenuItem value="Z">Z-функция</MenuItem>
            <MenuItem value="triangle">Треугольная</MenuItem>
            <MenuItem value="trapezoidal">Трапецеидальная</MenuItem>
          </TextField>
        </Grid>

        {parameterConfig[functionType].map((param) => (
          <Grid item xs={6} key={param}>
            <TextField
              label={`Параметр ${param.toUpperCase()}`}
              name={param}
              value={params[param] || ""}
              onChange={handleChangeParams}
              type="number"
              fullWidth
            />
          </Grid>
        ))}

        <Grid item xs={6}>
          <TextField
            label="Минимальное значение X"
            value={minX}
            onChange={handleMinXChange}
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Максимальное значение X"
            value={maxX}
            onChange={handleMaxXChange}
            type="number"
            fullWidth
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchGraphData}
        style={{ marginTop: "20px", marginRight: "10px" }}
        disabled={isLoading}
      >
        Построить график
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setIsDialogOpen(true)}
        style={{ marginTop: "20px" }}
      >
        Объяснение функции
      </Button>

      <Button
        variant="contained"
        sx={{
          marginTop: "20px",
          marginLeft: "10px",
          backgroundColor: "#e53935",
        }}
        onClick={handleOpenVideoDialog}
        style={{ marginTop: "20px", marginLeft: "10px" }}
        disabled={isLoading}
      >
        Видео
      </Button>

      {/* Диалоговое окно с видео */}
      <Dialog open={openVideoDialog} onClose={handleCloseVideoDialog} maxWidth="md" fullWidth>
        <DialogTitle>Видео</DialogTitle>
        <DialogContent>
          {videos.length === 0 ? (
            <Typography>Видео пока не добавлены</Typography>
          ) : (
            videos.map((video) => (
              video.url && typeof video.url === 'string' ? (
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
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    Удалить
                  </Button>
                </Box>
              ) : null
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpenAddVideoDialog} color="primary">
            Добавить видео
          </Button>
          <Button onClick={handleCloseVideoDialog} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалоговое окно для добавления видео */}
      <Dialog open={openAddVideoDialog} onClose={handleCloseAddVideoDialog}>
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
          <Button onClick={handleCloseAddVideoDialog}>Отмена</Button>
          <Button onClick={handleAddVideo} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Объяснение {functionType}-функции</DialogTitle>
        <DialogContent>
          <p>{descriptions[functionType]}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      {/* Блок с формулами */}
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Формула для {functionType === "S" ? "S-функции" : functionType === "Z" ? "Z-функции" : functionType === "triangle" ? "Треугольной функции" : "Трапецеидальной функции"}:
          </Typography>
          <BlockMath>
            {formulas[functionType]}
          </BlockMath>
        </Grid>
      </Grid>

      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      )}

      {graphData && graphData.x.length > 0 && graphData.y.length > 0 && (
        <div>
          {functionType === "trapezoidal" && (
            <div style={{ marginTop: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showBLine}
                    onChange={() => setShowBLine(!showBLine)}
                    color="primary"
                  />
                }
                label="Отобразить линию для параметра B"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCLine}
                    onChange={() => setShowCLine(!showCLine)}
                    color="primary"
                  />
                }
                label="Отобразить линию для параметра C"
              />
            </div>
          )}

          <Line
            data={{
              labels: graphData.x,
              datasets: [
                {
                  label: "Функция принадлежности",
                  data: graphData.y,
                  borderColor: "rgba(75,192,192,1)",
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                annotation: {
                  annotations: [
                    functionType === "trapezoidal" && showBLine && {
                      type: "line",
                      xMin: params.b - minX,
                      xMax: params.b - minX,
                      xScaleID: "x",
                      borderColor: "rgba(255, 99, 132, 1)",
                      borderWidth: 2,
                      borderDash: [5, 5],
                    },
                    functionType === "trapezoidal" && showCLine && {
                      type: "line",
                      xMin: params.c - minX,
                      xMax: params.c - minX,
                      xScaleID: "x",
                      borderColor: "rgba(54, 162, 235, 1)",
                      borderWidth: 2,
                      borderDash: [5, 5],
                    },
                  ].filter(Boolean),
                },
              },
            }}
            style={{ marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default MembershipFunction;