import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { fetchItems } from '../features/itemsSlice';
import type { RootState, AppDispatch } from '../store/store';
import Link from 'next/link';
import store from '../store/store';

const ItemsPage = () => {
//   const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, total } = useSelector((state: RootState) => state.items);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

//   useEffect(() => {
//     dispatch(fetchItems({ page, limit, search, status }));
//   }, [dispatch, page, search, status]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1); // Reset to the first page
  };

  const handleDelete = (id: string) => {
    // Implement your delete logic here
    console.log('Deleting item with id:', id);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    // <Provider store={store}>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Items List</h1>

      {/* Search and Filter */}
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={handleSearchChange}
          className="px-3 py-2 border rounded w-1/3"
        />
        <select
          value={status}
          onChange={handleStatusChange}
          className="px-3 py-2 border rounded w-1/4"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Add New Item Button */}
      <div className="mb-4">
        <Link href="/items/new">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
            Add New Item
          </button>
        </Link>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white mb-4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{item.status}</td>
              <td>
                {/* Edit Button */}
                <Link href={`/items/${item._id}`}>
                  <button className="mr-2 text-blue-500">Edit</button>
                </Link>
                
                {/* Delete Button */}
                <button className="text-red-500" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === Math.ceil(total / limit)}
          className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ItemsPage;
