'use strict';

var service = require('./../mail.service.js');


var generateHTMLMessage = function(user,locals){
	var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
            '<html xmlns="http://www.w3.org/1999/xhtml">' +
              '<head>' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
                '<meta name="viewport" content="width=device-width"/>' +
                '<title>Password reset</title>' +
              '</head>' +
            '<body>' +
            'Your password is reset to ' + locals.PWDRESETTOKEN +
            '<br>Login in with new password and we recommend you to change the password after login.' +
            ' <a href="'+locals.PWDRESET_URL+'">'+locals.PWDRESET_URL+'</a>'
            '<body>' +
            '</html>';
    return html;
}

var sendMail = function(user, passwordResetToken, callback){
    var locals = {
      COMPANY: 'Company Name',
      PWDRESET_URL :  process.env.DOMAIN +'/user/login',
      PWDRESETTOKEN : passwordResetToken 
    };
    var html = generateHTMLMessage(user,locals);
    service.sendmail('', user.email, 'Password reset', html, callback);
  };


exports.sendMail = sendMail;