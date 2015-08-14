'use strict';

var config = require('../config/environment');
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport(config.mail);

exports.sendmail = function(toName,toEmail,subject,body,callback) {
  var cb = callback || _.noop;
  var mailOptions = {
      from: config.mail.from,
      to: {
        name: toName,
        address: toEmail
      },
      subject: subject,
      html: body,
    };
    transporter.sendMail(mailOptions, function(error, info){
      cb(error,info);
    })
};
