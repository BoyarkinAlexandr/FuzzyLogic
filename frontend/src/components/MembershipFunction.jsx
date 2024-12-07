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
  Typography,
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

// Импортируем react-katex для рендеринга формул
import { BlockMath, InlineMath } from 'react-katex';  // Заменили MathJax на react-katex
import 'katex/dist/katex.min.css';  // Подключаем стили для KaTeX

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
                      mode: "vertical",
                      scaleID: "x",
                      value: params.b - minX,
                      borderColor: "rgba(255, 99, 132, 1)",
                      borderWidth: 2,
                      borderDash: [5, 5],
                    },
                    functionType === "trapezoidal" && showCLine && {
                      type: "line",
                      mode: "vertical",
                      scaleID: "x",
                      value: params.c - minX,
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
