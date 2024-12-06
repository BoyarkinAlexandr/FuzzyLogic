import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';

const Compozition = ({ onResult }) => {
  const [rowsA, setRowsA] = useState(2);  // Начальное количество строк для матрицы A
  const [colsA, setColsA] = useState(2);  // Начальное количество столбцов для матрицы A
  const [rowsB, setRowsB] = useState(2);  // Начальное количество строк для матрицы B
  const [colsB, setColsB] = useState(2);  // Начальное количество столбцов для матрицы B

  const [matrixA, setMatrixA] = useState(Array.from({ length: rowsA }, () => Array(colsA).fill(0)));
  const [matrixB, setMatrixB] = useState(Array.from({ length: rowsB }, () => Array(colsB).fill(0)));

  const handleMatrixChange = (matrix, row, col, value, matrixIndex) => {
    const updatedMatrix = matrixIndex === 0 ? [...matrixA] : [...matrixB];
    updatedMatrix[row][col] = parseFloat(value);
    matrixIndex === 0 ? setMatrixA(updatedMatrix) : setMatrixB(updatedMatrix);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/compute_composition/', {
        matrixA,
        matrixB
      });
      onResult(response.data.result, response.data.steps);
    } catch (error) {
      console.error("Error computing composition:", error);
    }
  };

  const handleDimensionChange = (e, setDimension, matrixIndex, type) => {
    let value = parseInt(e.target.value, 10);
    if (value < 1) {
      value = 1; // Устанавливаем минимальное значение 1 для строк и столбцов
    } else if (value > 6) {
      value = 6; // Ограничиваем количество столбцов и строк максимум 6
    }
    setDimension(value);

    // Обновляем матрицу при изменении строк или столбцов
    if (matrixIndex === 0) {
      if (type === 'rows') {
        setMatrixA(Array.from({ length: value }, (_, i) => matrixA[i] || Array(colsA).fill(0)));
      } else if (type === 'cols') {
        setMatrixA(matrixA.map(row => {
          if (row.length > value) {
            // Убираем лишние столбцы
            return row.slice(0, value);
          } else {
            // Добавляем недостающие столбцы
            return [
              ...row.slice(0, value),
              ...Array(value - row.length).fill(0),
            ];
          }
        }));
      }
    } else {
      if (type === 'rows') {
        setMatrixB(Array.from({ length: value }, (_, i) => matrixB[i] || Array(colsB).fill(0)));
      } else if (type === 'cols') {
        setMatrixB(matrixB.map(row => {
          if (row.length > value) {
            // Убираем лишние столбцы
            return row.slice(0, value);
          } else {
            // Добавляем недостающие столбцы
            return [
              ...row.slice(0, value),
              ...Array(value - row.length).fill(0),
            ];
          }
        }));
      }
    }
  };

  return (
    <div>
      <Typography variant="h6">Введите размеры матриц:</Typography>
      <Grid container spacing={3} direction="column">
        {/* Контейнер для матрицы A */}
        <Grid item xs={12}>
          <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Матрица A:</Typography>
            <TextField
              label="Количество строк"
              type="number"
              value={rowsA}
              onChange={(e) => handleDimensionChange(e, setRowsA, 0, 'rows')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Количество столбцов"
              type="number"
              value={colsA}
              onChange={(e) => handleDimensionChange(e, setColsA, 0, 'cols')}
              fullWidth
              margin="normal"
            />
            {matrixA.map((row, rowIndex) => (
              <Grid container spacing={1} key={rowIndex}>
                {row.map((col, colIndex) => (
                  <Grid item xs={12 / Math.min(colsA, 6)} key={colIndex}>
                    <TextField
                      label={`A[${rowIndex + 1}][${colIndex + 1}]`}
                      type="number"
                      value={col}
                      onChange={(e) => handleMatrixChange(matrixA, rowIndex, colIndex, e.target.value, 0)}
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        </Grid>

        {/* Контейнер для матрицы B */}
        <Grid item xs={12}>
          <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Матрица B:</Typography>
            <TextField
              label="Количество строк"
              type="number"
              value={rowsB}
              onChange={(e) => handleDimensionChange(e, setRowsB, 1, 'rows')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Количество столбцов"
              type="number"
              value={colsB}
              onChange={(e) => handleDimensionChange(e, setColsB, 1, 'cols')}
              fullWidth
              margin="normal"
            />
            {matrixB.map((row, rowIndex) => (
              <Grid container spacing={1} key={rowIndex}>
                {row.map((col, colIndex) => (
                  <Grid item xs={12 / Math.min(colsB, 6)} key={colIndex}>
                    <TextField
                      label={`B[${rowIndex + 1}][${colIndex + 1}]`}
                      type="number"
                      value={col}
                      onChange={(e) => handleMatrixChange(matrixB, rowIndex, colIndex, e.target.value, 1)}
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 3 }}
      >
        Вычислить композицию
      </Button>
    </div>
  );
};

export default Compozition;
