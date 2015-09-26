var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 3;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);


// here "socket" is passed by Socket.IO
module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, image) {
      if (err) throw err;

      image.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          var face = faces[i];

          // draw a rectangle around each face detected in the haarcascade
          // http://docs.opencv.org/modules/core/doc/drawing_functions.html#rectangle
          // rectangle(point 1, point 2, color[, thickness[, lineType[, shift]]])
          image.rectangle(
              [face.x, face.y],
              [face.width, face.height],
              rectColor,
              rectThickness
          );
        }

        socket.emit('frame', { buffer: image.toBuffer() });
      });
    });
  }, camInterval);
};
