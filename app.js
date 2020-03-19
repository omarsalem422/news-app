const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;
const CONNECTION_STRING = 'postgres://localhost:5433/newsdb';
const SALT_ROUNDS = 10;

// Configure the view engine
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded( {extended: false}) );

const db = pgp(CONNECTION_STRING);

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
          res.send('SUCCESS!');
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

