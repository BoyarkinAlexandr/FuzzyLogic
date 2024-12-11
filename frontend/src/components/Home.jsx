import React from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import { Link } from 'react-router-dom'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 

const methods = [
  { id: 1, name: "Графы", description: "Краткое описание метода 1. Этот метод помогает решать задачи оптимизации.", imageUrl: "./images/graphs.png", link: "/graphs" },
  { id: 2, name: "Композиция", description: "Краткое описание метода 2. Этот метод используется для анализа данных.", imageUrl: "./images/matrix.jpg", link: "/compozition" },
  { id: 3, name: "Функции принадлежности", description: "Краткое описание метода 3. Этот метод позволяет решать задачи с многими переменными.", imageUrl: "./images/function.jpg", link: "/member" },
  { id: 4, name: "α-сечениe", description: "Краткое описание метода 4. Этот метод полезен для работы с большими данными.", imageUrl: "https://via.placeholder.com/150", link: "/asection" },
  { id: 5, name: "Метод 5", description: "Краткое описание метода 5. Этот метод помогает в задачах с искусственным интеллектом.", imageUrl: "https://via.placeholder.com/150", link: "/method5" },
  { id: 6, name: "Метод 6", description: "Краткое описание метода 6. Этот метод используется в экономике для прогнозирования.", imageUrl: "https://via.placeholder.com/150", link: "/method6" },
  { id: 7, name: "Метод 7", description: "Краткое описание метода 7. Этот метод применяется в области биоинформатики.", imageUrl: "https://via.placeholder.com/150", link: "/method7" },
  { id: 8, name: "Метод 8", description: "Краткое описание метода 8. Этот метод используется для машинного обучения.", imageUrl: "https://via.placeholder.com/150", link: "/method8" }
];

const Home = ({ searchQuery }) => {
  const filteredMethods = methods.filter((method) => {
    const name = method.name || '';  
    return name.toLowerCase().includes((searchQuery || '').toLowerCase());
  });

  const isSingleMatch = filteredMethods.length === 1;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Главная страница
      </Typography>
      <Grid 
        container 
        spacing={3} 
        justifyContent="center" 
        sx={{
          width: isSingleMatch ? '1000px' : '100%', // Фиксированная ширина при одном совпадении
          marginLeft: isSingleMatch ? 'auto' : 0,  // Центрирование при одном совпадении
          marginRight: isSingleMatch ? 'auto' : 0, // Центрирование при одном совпадении
          padding: 0,
          marginTop: isSingleMatch ? 0 : '-24px', // Отступы для обычного состояния
        }}
      >
        {filteredMethods.length === 0 ? (
          <Typography variant="h6" align="center">
            Нет совпадений для "{searchQuery}"
          </Typography>
        ) : (
          filteredMethods.map((method) => (
            <Grid item xs={12} sm={6} md={4} key={method.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ position: 'relative', width: 345, height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={method.imageUrl}
                  alt={method.name}
                  sx={{
                    maxHeight: 140,   // Ограничение по высоте
                    width: '100%',    // Ширина на 100% от контейнера
                    objectFit: 'contain'  // Сохраняет пропорции и не обрезает картинку
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {method.name}
                  </Typography>

                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${method.id}-content`}
                      id={`panel-${method.id}-header`}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Краткое описание
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {method.description}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={method.link}>
                      <Button variant="contained" color="primary">
                        Перейти
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Home;
