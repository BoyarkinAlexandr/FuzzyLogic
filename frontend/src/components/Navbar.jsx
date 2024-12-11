import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppsIcon from '@mui/icons-material/Apps';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { toast } from "react-toastify";

const drawerWidth = 240;

export default function Navbar({ content, onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/"); // После выхода переходим на главную страницу
    toast.success("Вы успешно вышли!");
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Нечеткая логика
          </Typography>

          {/* Поле поиска по центру */}
          <Box sx={{ position: 'absolute', // Используем абсолютное позиционирование
          left: '50%', // Выравнивание по горизонтали
          transform: 'translateX(-50%)', // Центрирование
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1,}}>
            <TextField
              label="Поиск метода"
              variant="outlined"
              size="small"
              onChange={(e) => onSearch(e.target.value)} // Отправляем введённый текст в родительский компонент
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderWidth: 2, // Увеличиваем толщину ободка
                  },
                },
              }}
            />
          </Box>

          {/* Иконка профиля или кнопка "Войти" */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                {/* Кнопка "Выйти" */}
                <IconButton
                  color="inherit" // Красный цвет
                  onClick={handleLogout} // Логика выхода
                  sx={{
                    borderRadius: 5, // Закругленные углы
                    padding: '6px 12px', // Размер кнопки
                    fontStyle: 'oblique',
                    '&:hover': {
                      backgroundColor: '#f44336', // Цвет при наведении
                    },
                  }}
                >
                  Выход
                </IconButton>
              </>
            ) : (
              <>
                {/* Кнопка "Войти" с иконкой "+" */}
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/login" // Переход на страницу входа
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 5, // Закругленные углы
                    padding: '6px 12px',
                    fontWeight: 'medium',
                    fontStyle: 'oblique',
                    '&:hover': {
                      backgroundColor: '#195fa3', // Цвет при наведении
                    },
                  }}
                >
                  Вход
                <AccountCircle sx={{ fontSize: 30, marginLeft: 1}} /> {/* Иконка "+" с уменьшенным размером */}
                </IconButton>
              </>
            )}
          </Box>

        </Toolbar>
      </AppBar>

      {/* Боковая панель с навигацией */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <ListItem key={1} disablePadding>
            <ListItemButton component={Link} to="/" selected={"/" === location.pathname}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Главная страница"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={2} disablePadding>
            <ListItemButton component={Link} to="/graphs" selected={"/graphs" === location.pathname}>
              <ListItemIcon>
                <AirlineStopsIcon />
              </ListItemIcon>
              <ListItemText primary={"Графы"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={3} disablePadding>
            <ListItemButton component={Link} to="/compozition" selected={"/compozition" === location.pathname}>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary={"Композиция"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={4} disablePadding>
            <ListItemButton component={Link} to="/member" selected={"/member" === location.pathname}>
              <ListItemIcon>
                <LineAxisIcon />
              </ListItemIcon>
              <ListItemText primary={"Функции принадлежности"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={5} disablePadding>
            <ListItemButton component={Link} to="/asection" selected={"/member" === location.pathname}>
              <ListItemIcon>
                <LineAxisIcon />
              </ListItemIcon>
              <ListItemText primary={"α-сечение"} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Основной контент */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
