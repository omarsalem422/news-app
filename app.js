const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const PORT = process.env.PORT || 3000;

// Configure the view engine
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded( {extended: false}) );

app.post('/register', (req,res) => {

  let username = req.body.username;
  let password = req.body.password;

  console.log(username);
  console.log(password);

  res.send('REGISTER');

});

app.get('/register', (req, res) => {
  res.render('register');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});