const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const io = require('socket.io');
const session = require('express-session');
const store = require('connect-mongo')(session);
const mongoose = require('mongoose');
const path = require('path');

const config = require('../config');
const db = require('./db');
const api = require('./api');
const Backend = require('./api/extensions/socket_backend').Backend;
const serveSkins = require('./api/extensions/serve_skins.js')();

const app = express();
app.server = http.createServer(app);

app.set('views', path.join(__dirname, '../client'));

//session
app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    store: new store({ mongooseConnection: mongoose.connection })
}));

// creating sockets
const socket = io(app.server);
app.socket_backend = new Backend(socket);

app.use(express.static('./client'));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride('X-HTTP-Method-Override'));

db(() => {
    app.use('/api', api(app));
    process.on('SIGINT', () => {
        console.log("\nStopping...");
        process.exit();
    });
    app.server.listen(process.env.PORT || 8000);
    console.log(`Server started on port ${app.server.address().port}`);
});

module.exports = app;
