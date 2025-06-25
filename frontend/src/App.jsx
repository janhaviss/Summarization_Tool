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
    </div>
  );
}

export default App;
