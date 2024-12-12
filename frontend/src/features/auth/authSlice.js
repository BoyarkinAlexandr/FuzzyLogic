import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  userInfo:{},
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      // Регистрация пользователя, без автоматической активации
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);





export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return thunkAPI.rejectWithValue("Неверный email или пароль");
      } else {
        return thunkAPI.rejectWithValue("Что-то пошло не так");
      }
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

export const activate = createAsyncThunk(
  "auth/activate",
  async (userData, thunkAPI) => {
    try {
      // Активация аккаунта
      return await authService.activate(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData, thunkAPI) => {
      try {
          return await authService.resetPassword(userData)
      } catch (error) {
          const message = (error.response && error.response.data
              && error.response.data.message) ||
              error.message || error.toString()

          return thunkAPI.rejectWithValue(message)
      }
  }
);


export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async (userData, thunkAPI) => {
      try {
          return await authService.resetPasswordConfirm(userData)
      } catch (error) {
          const message = (error.response && error.response.data
              && error.response.data.message) ||
              error.message || error.toString()

          return thunkAPI.rejectWithValue(message)
      }
  }
);

export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (_, thunkAPI) => {
      try {
          const accessToken = thunkAPI.getState().auth.user.access
          return await authService.getUserInfo(accessToken)
      } catch (error) {
          const message = (error.response && error.response.data
              && error.response.data.message) ||
              error.message || error.toString()

          return thunkAPI.rejectWithValue(message)
      }
  }
);




export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Пожалуйста, проверьте ваш email для активации аккаунта.";
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Вход
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload)); // Обновление localStorage
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Выход
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.userInfo = {}; // Очистка информации о пользователе
      })
      // Активация
      .addCase(activate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // Сохраняем пользователя после активации
        state.message = "Ваш аккаунт успешно активирован.";
      })
      .addCase(activate.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
    })
    .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
    })
    .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = action.payload
        state.user = null
    })
    .addCase(resetPasswordConfirm.pending, (state) => {
      state.isLoading = true
  })
  .addCase(resetPasswordConfirm.fulfilled, (state) => {
      state.isLoading = false
      state.isSuccess = true
  })
  .addCase(resetPasswordConfirm.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = action.payload
      state.user = null
  })
  .addCase(getUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload
  })
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
