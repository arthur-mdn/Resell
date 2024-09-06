require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const uuid = require('uuid');
const {verify} = require("jsonwebtoken");


const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const config = require('./others/config');
const database = require('./others/database');
const verifyToken = require("./others/verifyToken");

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

app.use(cors((req, callback) => {
    const allowedOrigins = [config.clientUrl];
    let corsOptions;

    if (allowedOrigins.includes(req.header('Origin'))) {
        corsOptions = { origin: true, credentials: true};
    } else {
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
}));

app.use(cookieParser({
    sameSite: 'none',
    secure: true
}));

database.connect();

app.use(authRoutes);
app.use(itemRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

app.use((err, req, res, next) => {
    if (err) {
        res.status(400).json({ error: err.message });
    } else {
        next();
    }
});

server.listen(config.port, () => {
    console.log('Server started on port ' + config.port );
});