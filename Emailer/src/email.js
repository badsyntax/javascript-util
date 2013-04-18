/**
 * Simple node mailer
 * Author: Richard Willis (willis.rh@gmail.com)
 * Installation: Install dependancies via: `npm install`
 * Usage: node email.js path/to/email.html 'you@email.com,other@email.com'
 */

var mailer = (function() {

  'use strict';

  var fs = require('fs');
  var nodemailer = require('nodemailer');
  var crypto = require('crypto');
  var smtpTransport;

  var options = {
    auth: {
      user: 'your@gmail.com',
      pass: 'password'
    }
  };

  var message = {
    generateTextFromHTML: true,
    subject: 'Hello World!',
    to: 'some@email.com',
    attachments: []
  };

  function addAttachment(attachment) {
    message.attachments.push(attachment);
  }

  function embedInlineImages(path, html) {

    // does the path contain any directories?
    if (/\//.test(path)) {

      var parts = path.split('/');
      parts.pop();

      // Change CWD to allow us to embed relative images
      process.chdir(parts.join('/'));
    }

    return html.replace(/<img[^>]*>/gi, function(imgTag) {
      return imgTag.replace(/\b(src\s*=\s*(?:['"]?))([^'"> ]+)/i, function(src, prefix, url) {

        var cid = crypto.randomBytes(20).toString('hex') + "@possible";

        addAttachment({
          filePath: (url || '').trim(),
          cid: cid
        });

        return (prefix || '') + 'cid:' + cid;
      });
    });
  }

  function prepHTML(path, process) {
    // Get the HTML contents for the message
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) {
        throw new Error(err);
      }
      message.html = embedInlineImages(path, data);
      process();
    });
  }

  function onMailSend(error, response) {
    if (error) {
      console.log('Message not sent! ' + error);
    } else {
      console.log('Message sent: ' + response.message);
    }
    smtpTransport.close(); // shut down the connection pool, no more messages
  }

  function sendMail() {
    smtpTransport = nodemailer.createTransport('SMTP', options);
    smtpTransport.sendMail(message, onMailSend);
  }

  function send(path, toEmail) {

    if (!path) {
      throw new Error('Error: Please specify a path to a HTML document you wish to send in the email.');
    }
    if (!fs.existsSync(path)) {
      throw new Error('Error: file does not exist: ' + path);
    }
    if (toEmail) {
      message.to = toEmail;
    }

    prepHTML(path, function() {
      sendMail();
    });
  }

  return {
    send: send
  };
}());

try {
  var args = process.argv.splice(2);
  mailer.send(args[0], args[1]);
} catch (e) {
  // Display error message in friendly format
  console.log(e.message);
}