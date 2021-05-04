import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import issueAPI, { Issue } from "./../api/issue";

const initialState: Issue[] = [];

export const getIssues = createAsyncThunk(
  "issues/all",
  async (id, thunkAPI) => {
    const response = await issueAPI.fetchAll();
    return response;
  }
);

export const addIssue = createAsyncThunk<Issue, Issue>(
  "issues/add",
  async (payload, thunkAPI) => {
    const response = await issueAPI.add(payload);
    return response;
  }
);

export const removeIssue = createAsyncThunk<String, String | undefined>(
  "issues/remove",
  async (id, thunkAPI) => {
    if (!id) return "";
    await issueAPI.remove(id);
    return id;
  }
);

export const editIssue = createAsyncThunk<Issue, Issue>(
  "issues/edit",
  async (payload, thunkApi) => {
    const response = await issueAPI.edit(payload);
    return response;
  }
);

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIssues.fulfilled, (state, action) => {
      state.splice(0, state.length);
      action.payload.forEach((item) => {
        state.push(item);
      });
    });
    builder.addCase(addIssue.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(removeIssue.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(editIssue.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      }
    });
  },
});

export default issueSlice.reducer;
