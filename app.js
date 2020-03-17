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

app.post('/register', (req,res) => {

  let username = req.body.username;
  let password = req.body.password;
  
  db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
  .then ((user) => {
    if(user) {
      res.render('register', {message: "User name already exists"})
    } else {
      // INSERT user name into the db
      // db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, password])
      // .then(() => {
      //   res.send('SUCCESS')
      // })
      bcrypt .hash(password, SALT_ROUNDS, function(error, hash) {
        if (error == null) {
          db.none('INSERT INTO users(username, password) VALUES($1, $2)',[username, hash])
          .then(() => {
            res.send('SUCCESS')
          })
        }
      } )
    }
  })
 

});

app.get('/register', (req, res) => {
  res.render('register');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

