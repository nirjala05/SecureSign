import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // 🧡 CSS included

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("http://localhost:4000/login", { username, password }, { withCredentials: true })
      .then((res) => {
        navigate("/home");
      })
      .catch((err) => {
        alert("Login failed");
        console.error(err);
      });
  };

  return (
    <div className="login-container">
      <form  className="login-form" onSubmit={handleLogin}>
        <h2>Login 🔐</h2>
        <input
          type="text"
          placeholder="👤 Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
