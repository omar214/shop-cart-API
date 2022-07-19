const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();

// require routes
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const orderRoute = require('./routes/orderRoute');


// connect to db
const dbURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('db connected');
        app.listen(PORT, () => {
            console.log(`app listening to port ${PORT}`);
        })
    })
    .catch((err) => console.log(err));
mongoose.Promise = global.Promise;

// Middlewares
app.use(morgan("dev"));
app.use(cors())
app.use(express.urlencoded({ extended: true })); // send nested objects
app.use(express.json());


// Routes which should handle requests
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/orders', orderRoute);

// handle not found routes
app.use('*', (req, res) => {
    res.status(404);
    res.json({
        error: { message: 'Not found' }
    });

});


module.exports = app;