const chalk = require('chalk');
const express = require("express");
const expressEjs = require('ejs');
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var usersDB = require('userdb');
const router = express.Router();
const Schema = mongoose.Schema;
require('dotenv/config');

const port = 3003;


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
    console.log('connection to'+ this.dbName);
  }
})

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


// call the rest of the code and have it execute after 3 seconds

// Schemas
const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);


const app = express();
app.set("views", __dirname);

app.set("view engine", ".ejs");
app.set('views', path.join(__dirname, './views'));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//app.use(express.static(path.join(__dirname + '/public')));

app.use('/public', express.static(path.join(__dirname + '/public')));




app.get("/", (req, res) => {
  res.render("pages/index.ejs", { user: req.user });
});
app.get("/adminportal", (req, res) => {
  res.render("pages/admin-portal.ejs", { user: req.user.admin});
});
//Sign up Requests
app.get("/sign-up", (req, res) => res.render("./pages/sign-up-form"));
/*
app.post("/sign-up", (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  }).save(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});*/
app.post("/sign-up", (req, res, next) => {
bcrypt.hash(req.body.password, 10, function(err, hash) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  }).save(err => {
    if (err) return next(err);
    res.redirect("/");
    });
  });
});

app.post("/sign-up", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    }).then(function(hashedPassword) {
      return usersDB.saveUser(username, hashedPassword);
    }).then(function() {
        res.send();
    }).catch(function(error){
        console.log("Error saving user: ");
        console.log(error);
        next();
    }).save(err => {
        if (err) return next(err);
        res.redirect("/");
    });
  });
});


// Login & Logout Requests
app.post("/log-in", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);
/*
app.post('/login', function (req, res, next) { 
  var username = req.body.username;
  var password = req.body.password;

  usersDB.getUserByUsername(username)
    .then(function(user) {
        return bcrypt.compare(password, user.password);
    })
    .then(function(samePassword) {
        if(!samePassword) {
            res.status(403).send();
        }
        res.send();
    })
    .catch(function(error){
        console.log("Error authenticating user: ");
        console.log(error);
        next();
    });
});
*/
/*
app.post("/log-in", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
},
  hashAuth()
  )
);
function hashAuth() {
app.post('/log-in', function (req, res, next) { 
  var username = req.body.username;
  var password = req.body.password;

  usersDB.getUserByUsername(username)
    .then(function(user) {
        return bcrypt.compare(password, user.password);
    })
    .then(function(samePassword) {
        if(!samePassword) {
            res.status(403).send();
        }
        res.send();
    })
    .catch(function(error){
        console.log("Error authenticating user: ");
        console.log(error);
        next();
    });
  });
}
*/
app.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.listen(3003, () => console.log(`app listening on port ` + chalk.blue(port)));


// Passport Localstragity
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
