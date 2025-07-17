import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import MongoStore from "connect-mongo";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" DB connection error:", err));

app.use(session({
  name: "queen-session",
  secret: process.env.SESSION_SECRET, // you define in .env
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions"
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 30, // 1 day
    sameSite: "lax",
  }
}));

//  REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

//  LOGIN with Session
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ error: "Invalid username" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Wrong password" });

  // Save to session
  req.session.user = {
    id: user._id,
    username: user.username
  };

  res.json({ message: "Login successful" });
});

// PROFILE — only if session exists
app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

//Logout
app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
  });

  console.log(" User logged out");
  return res.json({ message: "Logged out successfully" });
});


app.listen(4000, () => console.log(" Server running at http://localhost:4000"));
