import React, { useEffect, useState } from 'react';
import { getHello } from './api';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHello();
        setMessage(data.message);
      } catch (error) {
        setMessage('Failed to fetch message');
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>React + FastAPI</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
}

export default App;