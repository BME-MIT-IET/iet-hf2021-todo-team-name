import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import classAPI, { Class } from "../api/class";

const initialState: Class[] = [];

export const getClasses = createAsyncThunk(
  "classes/all",
  async (id, thunkAPI) => {
    const response = await classAPI.fetchAll();
    return response;
  }
);

export const addClasses = createAsyncThunk<Class, Class>(
  "classes/add",
  async (payload, thunkAPI) => {
    console.log(payload);
    const response = await classAPI.add((payload as unknown) as Class);
    return response;
  }
);

export const removeClass = createAsyncThunk<String, String | undefined>(
  "classes/remove",
  async (id, thunkAPI) => {
    if (!id) return "";
    await classAPI.remove(id);
    return id;
  }
);

export const editClass = createAsyncThunk<Class, Class>(
  "classes/edit",
  async (payload, thunkApi) => {
    const response = await classAPI.edit(payload);
    return response;
  }
);

const classSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    addClass(state, action: PayloadAction<Class>) {
      state.push(action.payload);
    },
    // removeClass(state, action) {
    //   const index = state.findIndex((item) => item.id === action.payload);
    //   if (index > -1) {
    //     state.splice(index, 1);
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getClasses.fulfilled, (state, action) => {
      state.splice(0, state.length);
      action.payload.forEach((item) => {
        state.push(item);
      });
    });
    builder.addCase(addClasses.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(removeClass.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(editClass.fulfilled, (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      }
    });
  },
});

//const dispatch = useAppDispatch();
//dispatch(getClasses());

export const { addClass } = classSlice.actions;

export default classSlice.reducer;

// export const getClasses = () => {
//   return async (dispatch: Dispatch) => {
//     const response = await fetchClasses();
//     response.forEach((res: Class) => {
//       dispatch(addClass(res));
//     });
//   };
// };
