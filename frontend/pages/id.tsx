import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ItemForm from '../../components/Form';

const ItemPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true);
      axios
        .get(`/api/items/${id}`)
        .then((response) => setItem(response.data))
        .catch(() => setError('Failed to fetch item'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id === 'new' ? 'Add Item' : 'Edit Item'}</h1>
      <ItemForm item={item} />
    </div>
  );
};

export default ItemPage;
