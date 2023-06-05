const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const routes = require('./app/routes/router');
require('express-except')
const {jwtMiddleware} = require("./app/middleware/jwt_middleware");

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


app.use(jwtMiddleware)

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})