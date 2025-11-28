import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface ApiResponse {
  message: string;
}

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>('/api');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Redeemer Recovery</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{message}</p>
        )}
      </header>
    </div>
  )
}

export default App
