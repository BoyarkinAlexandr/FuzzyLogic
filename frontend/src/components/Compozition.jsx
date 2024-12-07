import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import axios from 'axios';

const Compozition = ({ onResult = () => {} }) => {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);

  const [matrixA, setMatrixA] = useState(Array.from({ length: rowsA }, () => Array(colsA).fill(0)));
  const [matrixB, setMatrixB] = useState(Array.from({ length: rowsB }, () => Array(colsB).fill(0)));
  const [resultMaxmin, setResultMaxmin] = useState(null);
  const [resultMinmax, setResultMinmax] = useState(null);
  const [resultMaxmult, setResultMaxmult] = useState(null);

  const handleMatrixChange = (matrix, row, col, value, matrixIndex) => {
    const updatedMatrix = matrixIndex === 0 ? [...matrixA] : [...matrixB];
    updatedMatrix[row][col] = parseFloat(value);
    matrixIndex === 0 ? setMatrixA(updatedMatrix) : setMatrixB(updatedMatrix);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/matrix/compute_composition/', {
        matrixA,
        matrixB
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setResultMaxmin(response.data.maxmin_composition);
      setResultMinmax(response.data.minmax_composition);
      setResultMaxmult(response.data.maxmultiplicative_composition);

      if (typeof onResult === 'function') {
        onResult(response.data);
      } else {
        console.error("onResult is not a function");
      }
    } catch (error) {
      console.error("Error computing composition:", error);
    }
  };

  const handleDimensionChange = (e, setDimension, matrixIndex, type) => {
    let value = parseInt(e.target.value, 10);
    if (value < 1) value = 1;
    else if (value > 6) value = 6;
    setDimension(value);
  
    if (matrixIndex === 0) {
      if (type === 'rows') {
        setMatrixA(prev => 
          Array.from({ length: value }, (_, i) => prev[i] || Array(colsA).fill(0))
        );
      } else if (type === 'cols') {
        setMatrixA(prev => 
          prev.map(row => row.slice(0, value).concat(Array(Math.max(value - row.length, 0)).fill(0)))
        );
      }
    } else {
      if (type === 'rows') {
        setMatrixB(prev => 
          Array.from({ length: value }, (_, i) => prev[i] || Array(colsB).fill(0))
        );
      } else if (type === 'cols') {
        setMatrixB(prev => 
          prev.map(row => row.slice(0, value).concat(Array(Math.max(value - row.length, 0)).fill(0)))
        );
      }
    }
  };
  

  const renderMatrix = (matrix, title) => {
    return (
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6">{title}</Typography>
        <TableContainer sx={{ marginTop: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                {matrix[0].map((_, colIndex) => (
                  <TableCell 
                    key={colIndex} 
                    align="center" 
                    sx={{ border: '1px solid #000' }} // Add border to header cells
                  >
                    {`Столбец. ${colIndex + 1}`}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {matrix.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((col, colIndex) => (
                    <TableCell 
                      key={colIndex} 
                      align="center" 
                      sx={{ border: '1px solid #000' }} // Add border to data cells
                    >
                      {col.toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <div>
      <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>Вычисление композиции</Typography> {/* Заголовок "Вычисление композиции" */}
      
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
                  <Grid item xs={12 / Math.min(colsA, 6)} key={colIndex} sx={{ padding: '10px' }}>
                    <TextField
                      label={`A[${rowIndex + 1}][${colIndex + 1}]`}
                      type="number"
                      value={col}
                      onChange={(e) => handleMatrixChange(matrixA, rowIndex, colIndex, e.target.value, 0)}
                      fullWidth
                      inputProps={{
                        step: 0.1, // Шаг изменения значения
                      }}
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
                  <Grid item xs={12 / Math.min(colsB, 6)} key={colIndex} sx={{padding:'10px'}}>
                    <TextField
                      label={`B[${rowIndex + 1}][${colIndex + 1}]`}
                      type="number"
                      value={col}
                      onChange={(e) => handleMatrixChange(matrixB, rowIndex, colIndex, e.target.value, 1)}
                      fullWidth
                      inputProps={{
                        step: 0.1, // Шаг изменения значения
                      }}
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

      {resultMaxmin && renderMatrix(resultMaxmin, 'Максминная композиция')}
      {resultMinmax && renderMatrix(resultMinmax, 'Минимаксная композиция')}
      {resultMaxmult && renderMatrix(resultMaxmult, 'Максумножительная композиция')}
    </div>
  );
};

export default Compozition;
