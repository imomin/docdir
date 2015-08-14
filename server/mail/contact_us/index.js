'use strict';

var config = require('../../config/environment');
var service = require('./../mail.service.js');

var generateHTMLMessage = function(mailContent){
	var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
            '<html xmlns="http://www.w3.org/1999/xhtml">' +
              '<head>' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
                '<meta name="viewport" content="width=device-width"/>' +
                '<title>Doctor Signup</title>' +
              '</head>' +
            '<body>' +
            '<p>'+
            'From: ' + mailContent.name +
            '<br>EMail: ' + mailContent.email +
            '<br>Phone: ' + mailContent.phone +
            '<br>Message: ' + mailContent.message +
            '</p>' +
            '<body>' +
            '</html>';
    return html;
}

var sendMail = function(mailContent, callback){
  var html = generateHTMLMessage(mailContent);
  service.sendmail(config.mail.from.name,config.mail.from.address, 'Message from Contact Us', html, callback);
};

exports.sendMail = sendMail;