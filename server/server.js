// modules
var express = require('express')
    , http = require('http')
    , morgan = require('morgan'); // logger for express

// configuration files
var configServer = require('./lib/config/server'); // just to keep it clean in here

// app parameters
var app = express();
app.set('port', configServer.httpPort);

// Allows the client to load the files in the "client" directory
// by simply addressing their name, e.g. "http://localhost:8080/app.js".
// It does work, try it in the browser.
app.use(express.static(configServer.staticFolder));

// dev: Concise output colored by response status for development use.
// The :status token will be colored red for server error codes,
// yellow for client error codes, cyan for redirection codes,
// and uncolored for all other codes.
app.use(morgan('dev'));

// NB: needs to be the last route added bc it matches ALL other routes
app.get('*', function (req, res) {
  // sendFile: send the file at the given path
  // root: look for the file to send in the given directory
  res.sendFile('index.html', { root: configServer.staticFolder });
});

// HTTP server
var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('HTTP server listening on port ' + app.get('port'));
});

// WebSocket server
// "Socket.IO enables real-time bidirectional event-based communication"
var io = require('socket.io')(server);

// This says that on the event of a 'connection' being established to
// the client, run the function in the `socket.js` file.
// That function creates a setInterval() that, 10x per second,
// takes a frame captured by the camera, finds images in it
io.on('connection', require('./lib/routes/socket'));

module.exports.app = app;
