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

      // "https://blogie-front-end.onrender.com",
      // "https://blogie-back-end.onrender.com",
      // "http://localhost:3000", 
      true,
    ],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type",

    //     // ],
    //     //
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.options("*", cors());
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
  console.log(userDoc, "DOCCCC");
  if (!userDoc) {
    console.log("user not found");
    return res.status(404).json({ error: "User not found" });
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      console.log(token, "token");
      return res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    return res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  console.log(req.cookies, "COOKIEE");
  if (!token || token == " ") {
    console.log("error");
    return res.status(401).json({ error: "JWT must be provided" });
  }
  const print1 = jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(200).json({ info, cookie: req.cookies });
  });
  // console.log(print1, "fdlsfldsjfl");
  // return res.json(req.cookies);
});

app.post("/logout", (req, res) => {
  console.log("hello");
  return res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
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
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
  console.log("Hello1");

  const { token } = req.cookies;
  console.log(req.cookies, "djflkdsjf");
  if (!token) {
    return res.status(401).json({ error: "JWT must be provided" });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    console.log("Hello2");
    if (err) {
      console.error(err); // Log the error for debugging purposes
      return res.status(401).json({ error: "Invalid token" });
    }
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    console.log(postDoc, "roejreij");
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
  return res.json(postDoc);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Serve running a tport 4000");
});
//NA7bbvjAAKDafsAZ
//mongodb+srv://blog:NA7bbvjAAKDafsAZ@cluster0.k8q2qhj.mongodb.net/?retryWrites=true&w=majority
