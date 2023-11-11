const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const User = require("./models/User");
const Post = require("./models/Post");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
require("dotenv").config();
app.use(
  cors({
    credentials: true,
    origin: [
      "https://blogie-front-end.onrender.com",
      "https://blogie-back-end.onrender.com",
      "http://localhost:3000",
    ],
    // true,
    //     // ],
    //     //
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
console.log("Jacob");
mongoose
  .connect(
    "mongodb+srv://blog:NA7bbvjAAKDafsAZ@cluster0.k8q2qhj.mongodb.net/?retryWrites=true&w=majority&ssl=true"
  )
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch(async (e) => {
    console.log("not connected");
    console.log(e);
  });

app.post("/register", async (req, res) => {
  // res.json({ requestDara: { username, password } });
  console.log("Hello");
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  console.log(userDoc);
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  console.log("bye");
  const print1 = jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  res.json(req.cookies);
  console.log(cookies);
  console.log(print1);
});

app.post("/logout", (req, res) => {
  console.log("hello");
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    // console.log(postDoc);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
    // .then((posts) => {
    //   console.log(posts);
    // })
    // .catch((err) => {
    //   console.error(`Error finding posts: ${err.message}`);
    //   console.error(err.stack);
    // })
  );
});
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Serve running a tport 4000");
});
//NA7bbvjAAKDafsAZ
//mongodb+srv://blog:NA7bbvjAAKDafsAZ@cluster0.k8q2qhj.mongodb.net/?retryWrites=true&w=majority
