const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/error');
const bodyParser = require('body-parser');
const cors = require('cors');

// Setting up config file
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);
// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
