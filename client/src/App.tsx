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
      <div className="cross-background"></div>
      <header className="App-header">
        <div className="logo-container">
          <div className="cross-icon">✝</div>
          <h1>Redeemer Recovery</h1>
          <p className="subtitle">A Journey of Healing and Hope</p>
        </div>

        <div className="scripture-verse">
          <p className="verse-text">"He heals the brokenhearted and binds up their wounds."</p>
          <p className="verse-reference">- Psalm 147:3</p>
        </div>

        <div className="content-section">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <div className="message-box">
              <p>{message}</p>
            </div>
          )}
        </div>

        <div className="footer-section">
          <p className="footer-text">Walking in faith, one step at a time</p>
        </div>
      </header>
    </div>
  )
}

export default App
