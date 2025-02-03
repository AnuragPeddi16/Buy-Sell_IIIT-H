require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const connectDB = require('./utils/connectdb');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('dev')); // for logging

// cors restrictions (to restrict api access)
const corsOptions = {

    origin: (origin, callback) => {

        if (origin === process.env.FRONTEND_URL) callback(null, true); // allow frontend requests
        else callback(new Error('Not allowed by CORS'), false); // deny others

    },

    credentials: true,

};

app.use(cors(corsOptions)); // comment when testing

app.use((err, req, res, next) => {

    // if CORS error, return forbidden
    if (err.message.includes('Not allowed by CORS')) res.status(403).send("<h1> 403 Forbidden</h1><p>Request origin not allowed</p>");
    else next(err); // Pass to the next error handler

});
  

connectDB();

app.use('/api', apiRoutes);

app.get("/", (req, res) => {

    res.send("<h2>Hello World!</h2>");

});

app.use((req, res) => {

    res.status(404).send("<h1>404: Not Found</h1>")

});

module.exports = app;