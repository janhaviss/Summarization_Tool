<<<<<<< HEAD
import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello")
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="text-center p-10 text-xl text-blue-500">
      {msg ? msg : "Loading..."}
=======
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
>>>>>>> b63f7ed5cd7b7303d11e64ee410ea69beebfc54d
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> b63f7ed5cd7b7303d11e64ee410ea69beebfc54d
