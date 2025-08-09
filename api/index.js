const { app } = require('@azure/functions');

// Register your submitTicket function
require('./submitTicket/index');  // if submitTicket/index.js contains app.http(...)
require('./getTicket/index');    // same here
