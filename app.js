const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const app = express();
const PORT = 4000;

// Creating 24 hours through milliseconds
const DAY = 1000 * 60 * 60 * 24;

// Default username and password
const myusername = "user"
const mypassword = "mypassword"

// Incoming data parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Serving public file
app.use(express.static(__dirname));

// Session middleware
app.use(sessions({
  secret: "thisismysecrctekeyhihihihahaha",
  saveUninitialized: true,
  cookie: { maxAge: DAY },
  resave: false
}));

var session;

// Endpoints
app.get("/",(req,res) => {
  session = req.session;

  // If session still exists
  if (session.userid) {
    res.send("Hello again user. <a href=\'/logout'>click here to logout</a>");
  } else {
    res.sendFile("public/index.html", {root:__dirname})
  }
});

app.post("/login",(req, res) => {
  if (req.body.username == myusername && req.body.password == mypassword) {
    session = req.session;
    session.userid = req.body.username;
    console.log(req.session);
    res.send("Hey there, welcome. <a href=\'/logout'>click here to logout</a>");
  }
  else {
    res.send("Invalid username or password");
  }
});

app.get("/logout",(req, res) => {
  req.session.destroy();
  console.log(req.session); // will return undefined due to session being destroyed
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
