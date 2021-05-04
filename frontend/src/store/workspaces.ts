import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import workspaceAPI, { Workspace } from "./../api/workspace";

const initialState: Workspace[] = [];

export const getWorkspaces = createAsyncThunk(
  "workspaces/all",
  async (id, thunkAPI) => {
    const response = await workspaceAPI.getAll();
    return response;
  }
);

export const getWorkspace = createAsyncThunk(
  "workspaces/get",
  async (id: string, thunkAPI) => {
    const response = await workspaceAPI.getWorkspace(id);
    return response;
  }
);

export const createWorkspace = createAsyncThunk(
  "workspaces/create",
  async (name: string, thunkAPI) => {
    const response = await workspaceAPI.create(name);
    return response;
  }
);

export const addUserToWorkspace = createAsyncThunk(
  "workspaces/adduser",
  async (arg: { id: string; userID: string }, thunkAPI) => {
    const response = await workspaceAPI.addUser(arg.id, arg.userID);
    return response;
  }
);

export const changeWorkspaceUsers = createAsyncThunk<
  Workspace,
  { id: string; userIDs: string[] }
>("workspaces/changeuser", async (arg, thunkAPI) => {
  const response = await workspaceAPI.changeUsers(arg.id, arg.userIDs);
  return response;
});

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWorkspaces.fulfilled, (state, action) => {
      return (state = action.payload);
    });
    builder.addCase(addUserToWorkspace.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index > -1) state[index] = action.payload;
    });
    builder.addCase(createWorkspace.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(changeWorkspaceUsers.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      state[index] = action.payload;
    });
  },
});

export default workspaceSlice.reducer;
