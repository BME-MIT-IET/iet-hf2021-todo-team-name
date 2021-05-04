import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import userAPI, { AuthenticateResult } from "../api/user";
import { User } from "./../api/user";
import axios from "axios";
import JwtDecode from "jwt-decode";

interface ISetToken {
  token: string;
}
interface Token {
  email: string;
  unique_name: string;
  exp: number;
  nameid: string;
}

export const logIn = createAsyncThunk<
  AuthenticateResult,
  { email: String; password: String }
>("users/login", async (args, thunkAPI) => {
  const response = userAPI.login(args.email, args.password);
  return response;
});

export const register = createAsyncThunk<
  AuthenticateResult,
  { name: string; email: string; password: string }
>("users/register", async (args, thunkAPI) => {
  const response = userAPI.register(args.name, args.email, args.password);
  return response;
});

export const getUsers = createAsyncThunk("users/all", async (arg, thunkAPI) => {
  const response = userAPI.getAll();
  return response;
});

const initialState: { user?: User; token?: string; otherUsers: User[] } = {
  otherUsers: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<ISetToken>) {
      state.token = action.payload.token;
      const decoded = JwtDecode(action.payload.token) as Token;
      state.user = {
        id: decoded.nameid,
        name: decoded.unique_name,
        email: decoded.email,
      };
      setAuthorizationToken(action.payload.token);
    },
    logout(state) {
      state.token = undefined;
      state.user = undefined;
      setAuthorizationToken("");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logIn.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      setAuthorizationToken(action.payload.token);
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      setAuthorizationToken(action.payload.token);
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.otherUsers = action.payload.filter(
        (item) => item.id !== state.user?.id
      );
    });
  },
});

export const { setToken, logout } = userSlice.actions;

export function setAuthorizationToken(token: string) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

export default userSlice.reducer;
