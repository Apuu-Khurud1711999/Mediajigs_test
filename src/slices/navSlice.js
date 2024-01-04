import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNavsAsync = createAsyncThunk(
  'auth/fetchNavs',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://scorenodeapi.cloudd.live/admin/tabs',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const navSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    nav: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNavsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nav = action.payload;
      })
      .addCase(fetchNavsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setToken } = navSlice.actions;
export default navSlice.reducer;
