const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { User } = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 8181;
const app = express();

const mongoUri = `mongodb+srv://chestermane:Extreme%401@cluster0.spoz5q6.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoUri);

// middleware
app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.post("/api/user", (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  user.save((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

app.post("/api/user/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) res.send(400).send(err);
    if (!user) res.json({ message: "User not found!" });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) res.status(400).send(err);
      if (!isMatch) res.json({ message: "Bad password" });

      user.generateToken((err, user) => {
        if (err) res.status(400).send(err);
        res.cookie("auth", user.token).send("ok");
      });
    });
  });
});

// alternative auth token check
const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  const token = req.cookies.auth;

  jwt.verify(token, "supersecretpassword", (err, decode) => {
    if (!decode) res.status(401).send({ message: "bad token man" });
    next();
  });
};

app.get("/api/books", authenticate, (req, res) => {
  //commenting this out for alternative auth method above
  // let token = req.cookies.auth;

  // User.findByToken(token, (err, user) => {
  //   if (err) throw err;
  //   if (!user) res.status(401).send({ message: "bad user data" });
  // });
  res.status(200).send("Move forward");
});

app.listen(PORT, () => {
  console.log(`started on port ${PORT}`);
});
