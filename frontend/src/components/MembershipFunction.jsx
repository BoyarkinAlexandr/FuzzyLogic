import React, { useState } from "react";
import axios from "axios";
import ChartAnnotation from 'chartjs-plugin-annotation';
ChartJS.register(ChartAnnotation);
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
} from "@mui/material";
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

// Регистрация компонентов для графика
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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

  const [functionType, setFunctionType] = useState("S");
  const [params, setParams] = useState({ a: 1, b: 5 }); // Начальные параметры
  const [minX, setMinX] = useState(1);
  const [maxX, setMaxX] = useState(10);
  const [graphData, setGraphData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Управление диалогом
  const [isLoading, setIsLoading] = useState(false); // Управление состоянием загрузки

  // Состояния для отображения линий B и C
  const [showBLine, setShowBLine] = useState(true);
  const [showCLine, setShowCLine] = useState(true);

  // Обновляем параметры при смене типа функции
  const handleFunctionTypeChange = (e) => {
    const selectedFunction = e.target.value;
    setFunctionType(selectedFunction);

    // Сбрасываем параметры в зависимости от выбранной функции
    const newParams = {};
    parameterConfig[selectedFunction].forEach((param) => {
      newParams[param] = 0; // Устанавливаем начальные значения параметров
    });
    setParams(newParams);
  };

  // Обновление конкретного параметра
  const handleChangeParams = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setParams({ ...params, [name]: numericValue });
    }
  };

  // Обновление минимального значения X
  const handleMinXChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setMinX(value);
    }
  };

  // Обновление максимального значения X
  const handleMaxXChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setMaxX(value);
    }
  };

  // Запрос данных графика
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
        {/* Выбор типа функции */}
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

        {/* Поля ввода для параметров функции */}
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

        {/* Поля ввода для диапазона X */}
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

      {/* Кнопка для построения графика */}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchGraphData}
        style={{ marginTop: "20px", marginRight: "10px" }}
        disabled={isLoading} // Отключение кнопки во время загрузки
      >
        Построить график
      </Button>

      {/* Кнопка для объяснения функции */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setIsDialogOpen(true)}
        style={{ marginTop: "20px" }}
      >
        Объяснение функции
      </Button>

      {/* Диалоговое окно с описанием */}
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

      {/* Индикатор загрузки */}
      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      )}

      {/* Отображение графика */}
      {graphData && graphData.x.length > 0 && graphData.y.length > 0 && (
        <div>
          {/* Чекбоксы для отображения линий B и C */}
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
                    // Отображение вертикальной линии для B
                    showBLine && {
                      type: "line",
                      mode: "vertical",
                      scaleID: "x",
                      value: params.b - minX,
                      borderColor: "rgba(255, 99, 132, 1)",
                      borderWidth: 2,
                      borderDash: [5, 5], // Пунктирная линия
                    },
                    // Отображение вертикальной линии для C
                    showCLine && {
                      type: "line",
                      mode: "vertical",
                      scaleID: "x",
                      value: params.c - minX,
                      borderColor: "rgba(54, 162, 235, 1)",
                      borderWidth: 2,
                      borderDash: [5, 5], // Пунктирная линия
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
