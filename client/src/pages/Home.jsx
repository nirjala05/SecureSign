import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:4000/profile", { withCredentials: true })
      .then(res => {
        if (res.data.user) {
          setUsername("Welcome " + res.data.user.username);
        } else {
          alert("Not logged in");
          navigate("/login");
        }
      })
      .catch(() => {
        alert("Not logged in");
        navigate("/login");
      });
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:4000/logout", { withCredentials: true })
      .then(() => {
        navigate("/login"); //  Go back to login page
      })
      .catch((err) => {
        alert("Logout failed");
        console.log(err);
      });
  };

  return (
    <div
      style={{
        background: "#444",
        height: "100vh",
        color: "white",
        padding: "20px",
        position: "relative",
      }}
    >
      {/*  Logout Top-Right */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <button
          onClick={handleLogout}
          style={{
            color: "white",
            backgroundColor: "#666",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/*  Centered Welcome */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <h1 style={{ fontSize: "2.5rem" }}>{username}</h1>
      </div>
    </div>
  );
}

export default Home;
