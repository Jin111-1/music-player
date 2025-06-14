import { useState, useEffect } from 'react';
import axios from 'axios';
export function useSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const fetchSongs = async () => {
  try {
    const response = await axios.get('/api/songs');
    setSongs(response.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
useEffect(() => {
  fetchSongs();
}, []);
  return { songs, loading, error };
} 