import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Item {
  _id: string;
  title: string;
  description?: string;
  status: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
  total: number; // To store the total number of items for pagination
  page: number;  // Track the current page
  limit: number; // Track the limit of items per page
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

// Async Thunks
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async ({ page = 1, limit = 10, search = '', status = '' }: any) => {
    const response = await axios.get('/api/items', {
      params: { page, limit, search, status },
    });
    return response.data; // Should return { items, total }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total; // Add total count for pagination
        state.page = action.payload.page;   // Set current page from response
        state.limit = action.payload.limit; // Set current limit from response
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      });
  },
});

export default itemsSlice.reducer;
