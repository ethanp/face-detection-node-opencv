/***********************************
 * App running in client's browser *
 ***********************************/

// connect to the [LOCALLY RUNNING] Node server
// I can't figure out where the `io` variable is COMING FROM !!
// But it seems like it's coming from the server.js page ?!
var socket = io.connect('http://localhost');

var canvas = document.getElementById('canvas-video');

// create a 2D rendering context for the canvas, i.e. something you can draw on
var context = canvas.getContext('2d');

// Returns an HTMLImageElement instance just as document.createElement('img') would
var img = new Image();

// show loading notice
context.fillStyle = '#333';
context.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3);

socket.on('frame', function (data) {
  // Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
  var uint8Arr = new Uint8Array(data.buffer);

  // apply: call the function where the first parameter here is the `this` value
  //        and the rest are the normal downstream function parameters
  //
  // fromCharCode: turn the given sequence of unicode values into an actual `string`
  var str = String.fromCharCode.apply(null, uint8Arr);

  // btoa: create a base-64 ASCII string from a "string" of binary data
  var base64String = btoa(str);

  // onload: the callback called when any HTML element loads
  img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;
});
