import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import exported from "../api/class";
import labelAPI, { Label } from "../api/label";

export const getLabels = createAsyncThunk(
  "labels/getall",
  async (args, thunkAPI) => {
    const response = await labelAPI.getAll();
    return response;
  }
);

export const addLabel = createAsyncThunk<Label, Label>(
  "labels/add",
  async (label, thunkAPI) => {
    const response = await labelAPI.add(label);
    return label;
  }
);

export const deleteLabel = createAsyncThunk<string, string>(
  "labels/delete",
  async (labelid, thunkAPI) => {
    const response = await labelAPI.deleteLabel(labelid);
    return labelid;
  }
);

const initialState: Label[] = [];

const labelSlice = createSlice({
  name: "labels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLabels.fulfilled, (state, action) => {
      state.splice(0, state.length);
      action.payload.forEach((item) => {
        state.push(item);
      });
    });
    builder.addCase(addLabel.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(deleteLabel.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id == action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    });
  },
});

export default labelSlice.reducer;
