const chalk = require('chalk');
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('dotenv/config')
require('./public/shopping-cart');

const port = 3003;

const mongoDb = `mongodb://localhost:27017/test`;
mongoose.connect(mongoDb, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

/*
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
const db = mongoose.connection;
mongoose.connect("mongodb://localhost:27017/test",{
  useNewUrlParser: true,
  reconnectInterval: 500,
  socketTimeoutMS: 0,
  connectTimeoutMS: 0,
  autoReconnect: true,
  dbName: 'test'
},

function (err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!' + err));
    console.log(chalk.red(err));
  }
  else{
    console.log(chalk.green('connection to MongoDB!'));
  }
});*/


const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname + '/public')));
app.use('/public', express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname, './views'));

app.get("/", (req, res) => {
  res.render("pages/index.ejs", { user: req.user });
});
//var myScripts = require('./public/shopping-cart.js');

// about page 
app.get('/about', function(req, res) {
  res.render('pages/about');
});
app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  }).save(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);
app.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.listen(3003, () => console.log(`app listening on port ` + chalk.blue(port)));

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { msg: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { msg: "Incorrect password" });
      }
      return done(null, user);
    });
  })
);passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
