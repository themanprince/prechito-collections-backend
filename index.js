const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const connectDB = require(__dirname + "/helpers/connectDB");

const app = express();
//before further ado done
dotenv.config();

/* configure body-parser */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const { auth_route, product_route, cart_route, order_route } = require('./routes');

app.use('/api/v1/auth/admin', auth_route);
/*app.use('/api/v1/users', user_route);*/ //wont be needing this for now
app.use('/api/v1/products', product_route);
app.use('/api/v1/carts', cart_route);
app.use('/api/v1/orders', order_route);

/* listen for requests */
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
