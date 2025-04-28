const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const cookie = require("cookie-parser");

const authRoutes = require("./Routes/auth");
const noteRoutes = require("./Routes/notes");

const app = express();
const PORT = 6969;

dotenv.config();
app.use(
  cors({
    // origin: "https://savedocument-15a7kxn53-zynx0011s-projects.vercel.app/",
    origin: "*",
    // credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookie());

try {
  mongoose.connect(process.env.MONGODB_URI);
  console.log("Connection Successfull");
} catch (error) {
  console.log(error);
}

app.get("/", (req, res) => {
  res.send("Server Is Running");
});

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/files", express.static("files"));

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
