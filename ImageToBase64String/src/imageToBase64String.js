/*global require:false, Buffer:false, console:false, process:false*/

/**
 * Image to Base64 encoded string script
 * Supports: png, jpg, gif
 * Usage: `node imageToBase64String.js path/to/image.jpg`
 */

var imgToBase64String = (function() {

  'use strict';

  var fs = require('fs');

  function getMimeType(image_path) {

    var ext = image_path.split('.').pop();

    switch (ext) {
      case 'png':
        return 'image/png';
      case 'jpg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      default:
        throw new Error('Unsuported mime type!');
    }
  }

  function getBase64String(image_path, process) {
    fs.readFile(image_path, function(err, data) {
      if (err) {
        throw err;
      }
      process(new Buffer(data, 'binary').toString('base64'));
    });
  }

  function convert(image_path) {

    if (!image_path) {
      throw new Error('Please specify a path to an image');
    }
    if (!fs.existsSync(image_path)) {
      throw new Error('Image does not exist: ' + image_path);
    }

    getBase64String(image_path, function(base64string) {
      var str = 'data:' + getMimeType(image_path) + ';base64,' + base64string;
      process.stdout.write(str);
    });
  }

  return convert;

}());

var args = process.argv.splice(2);

try {
  imgToBase64String(args[0]);
} catch (e) {
  console.log('Error:', e.message);
}
