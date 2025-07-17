import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/register",
        { username, password },
        { withCredentials: true }
      );

      console.log("Registered:", res.data);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Register error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Registration failed!");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={registerUser}>
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
        <p>
          Already have an account? <a href="/">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
