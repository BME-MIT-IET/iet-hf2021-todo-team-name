import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Issue } from "../api/issue";
import columnAPI, { Column } from "./../api/column";

const initialState: Column[] = [];

export const getColumns = createAsyncThunk(
  "columns/all",
  async (id, thunkAPI) => {
    const response = await columnAPI.fetchAll();
    return response;
  }
);

export const addColumn = createAsyncThunk<Column, Column>(
  "columns/add",
  async (payload, thunkAPI) => {
    const response = await columnAPI.add(payload);
    return response;
  }
);

export const removeColumn = createAsyncThunk<String, String | undefined>(
  "columns/remove",
  async (id, thunkAPI) => {
    if (!id) return "";
    await columnAPI.remove(id);
    return id;
  }
);

export const editColumn = createAsyncThunk<Column, Column>(
  "columns/edit",
  async (payload, thunkApi) => {
    const response = await columnAPI.edit(payload);
    return response;
  }
);

export const addIssue = createAsyncThunk<
  {
    response: { id: String; issueid: String } | undefined;
    newIssue: Issue | undefined;
  },
  { id: String; issueid: String }
>("columns/addissue", async (payload, thunkApi) => {
  const response = await columnAPI.addIssue(payload.id, payload.issueid);
  const state: any = thunkApi.getState();
  const newIssue = state.issues.find(
    (item: Issue) => item.id === payload.issueid
  );
  return { response, newIssue };
});

export const createAndAdd = createAsyncThunk<
  { id: String; newIssue: Issue } | undefined,
  { id: String; newIssue: Issue }
>("columns/createandadd", async (payload, thunkApi) => {
  const response = await columnAPI.createAndAdd(payload.id, payload.newIssue);
  return response;
});

export const addIssueToFirstColumn = createAsyncThunk<Issue | undefined, Issue>(
  "columns/addissuetofirstcolumn",
  async (payload, thunkApi) => {
    const response = await columnAPI.addIssueToFirstColumn(payload);
    return response;
  }
);

export const moveIssue = createAsyncThunk<
  { origin: String; destination: String; newIssue: Issue } | undefined,
  { origin: String; destination: String; newIssue: Issue }
>("columns/moveissue", async (payload, thunkApi) => {
  console.log("MOVE ISSUE", payload);
  const response = await columnAPI.moveIssue(
    payload.origin,
    payload.destination,
    payload.newIssue
  );
  return response;
});

export const removeIssue = createAsyncThunk<
  { id: String; issueId: String } | undefined,
  { id: String; issueId: String }
>("columns/removeissue", async (payload, thunkApi) => {
  const response = await columnAPI.removeIssue(payload.id, payload.issueId);
  return response;
});

const columnSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getColumns.fulfilled, (state, action) => {
      state.splice(0, state.length);
      action.payload.forEach((item) => {
        state.push(item);
      });
    });
    builder.addCase(addColumn.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(removeColumn.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(editColumn.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      }
    });
    builder.addCase(addIssue.fulfilled, (state, action) => {
      if (action.payload.response) {
        const index = state.findIndex(
          (item) => item.id === action.payload.response?.id
        );
        if (index === -1) return;
        const issueIndex = state[index].issues.findIndex(
          (issue) => issue.id === action.payload.response?.issueid
        );
        if (issueIndex !== -1) return;
        if (action.payload.newIssue)
          state[index].issues = [
            ...state[index].issues,
            action.payload.newIssue,
          ];
      }
    });
    builder.addCase(createAndAdd.fulfilled, (state, action) => {
      if (action.payload) {
        const index = state.findIndex((item) => item.id === action.payload?.id);
        if (index === -1) return;
        const issueIndex = state[index].issues.findIndex(
          (issue) => issue.id === action.payload?.newIssue.id
        );
        if (issueIndex !== -1) return;
        state[index].issues = [...state[index].issues, action.payload.newIssue];
      }
    });
    builder.addCase(moveIssue.fulfilled, (state, action) => {
      if (action.payload) {
        const originIndex = state.findIndex(
          (item) => item.id === action.payload?.origin
        );
        if (originIndex === -1) return;

        const destinationIndex = state.findIndex(
          (item) => item.id === action.payload?.destination
        );
        if (destinationIndex === -1) return;

        const originIssueIndex = state[originIndex].issues.findIndex(
          (issue) => issue.id === action.payload?.newIssue.id
        );
        if (originIssueIndex === -1) return;

        const destinationIssueIndex = state[destinationIndex].issues.findIndex(
          (issue) => issue.id === action.payload?.newIssue.id
        );
        if (destinationIssueIndex !== -1) return;

        state[destinationIndex].issues = [
          ...state[destinationIndex].issues,
          action.payload?.newIssue,
        ];
        let clone = Object.assign([], state[originIndex].issues);
        clone.splice(originIssueIndex, 1);
        state[originIndex].issues = clone;
      }
    });
    builder.addCase(addIssueToFirstColumn.fulfilled, (state, action) => {
      if (action.payload) {
        if (state.length === 0) return;
        const issueIndex = state[0].issues.findIndex(
          (issue) => issue.id === action.payload?.id
        );
        if (issueIndex !== -1) return;
        state[0].issues = [...state[0].issues, action.payload];
      }
    });
    builder.addCase(removeIssue.fulfilled, (state, action) => {
      if (typeof action.payload !== "undefined") {
        const index = state.findIndex((item) => item.id === action.payload?.id);
        if (index === -1) return;
        const issueIndex = state[index].issues.findIndex(
          (item) => item.id === action.payload?.issueId
        );
        if (issueIndex === -1) return;
        let clone = Object.assign([], state[index].issues);
        clone.splice(issueIndex, 1);
        state[index].issues = clone;
      }
    });
  },
});

export default columnSlice.reducer;
