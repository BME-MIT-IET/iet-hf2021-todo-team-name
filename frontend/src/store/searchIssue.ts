import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import issueAPI, { Issue } from "./../api/issue";

const initialState: Issue[] = [];

export const searchIssue = createAsyncThunk<Issue[], string>(
  "issues/search",
  async (payload, thunkApi) => {
    issueAPI.cancelTokenSource.cancel();
    const response = await issueAPI.search(payload);
    return response;
  }
);

const searchIssueSlice = createSlice({
  name: "searchIssue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchIssue.fulfilled, (state, action) => {
      return (state = action.payload);
    });
  },
});

export default searchIssueSlice.reducer;
