const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const session = require('express-session');

const PORT = process.env.PORT || 3000;
const CONNECTION_STRING = 'postgres://localhost:5433/newsdb';
const SALT_ROUNDS = 10;

// Configure the view engine
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded( {extended: false}) );

app.use(session({
  secret: "jljlksdjglkds",
  resave: false,
  saveUninitialized: false
}));

const db = pgp(CONNECTION_STRING);

app.get('/users/articles', (req, res) => {
  res.render('articles', {username: req.session.user.username});
});
app.get('/login', (req, res) => {
  res.render('login');
});

// app.post('/login', (req, res) => {

//   let username = req.body.username;
//   let password = req.body.password;


// });
app.post('/login', (req,res) => {

  let username = req.body.username;
  let password = req.body.password;
  db.oneOrNone('SELECT userid, username, password FROM users WHERE username = $1', [username])
  .then((user) => {
    if(user) {
      bcrypt.compare(password, user.password, function(error, result) {
        if(result) {
          // put username and userId in the session
          if (req.session) {
            req.session.user = {userId: user.userId, username: username};
          } 
          res.redirect('/users/articles')
          
        } else {
          res.render('login', {message: 'Invalid user name or password!'});
        }
      })
    } else {
      res.render('login', {message: 'Invalid user name or password!'});
    }

  } )
 
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

