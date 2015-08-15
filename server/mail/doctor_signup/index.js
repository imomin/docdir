'use strict';

var service = require('./../mail.service.js');


var generateHTMLMessage = function(doctor,locals){
	var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
            '<html xmlns="http://www.w3.org/1999/xhtml">' +
              '<head>' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
                '<meta name="viewport" content="width=device-width"/>' +
                '<title>Doctor Signup</title>' +
              '</head>' +
            '<body>' +
            '<p>Welcome, and thank you for creating an account with '+ locals.COMPANY+'!'+
            '<br>Please click on the button below to confirm your account. Once confirmed, you will have full access to '+ locals.COMPANY+'!.</p>' +
            '<br><a href="'+locals.CONFIRMATION_URL+'/'+locals.MAIL_CONFIRMATION_TOKEN+'">Confirm email address</a>' +
            '</body>' +
            '</html>';
    return html;
}

var sendMail = function(doctor, mailConfirmationToken, callback){
  var locals = {
    COMPANY: 'Sugar Land Doctors',
    CONFIRMATION_URL : process.env.DOMAIN +'/doctor/confirm/',
    MAIL_CONFIRMATION_TOKEN : mailConfirmationToken 
  };
  var html = generateHTMLMessage(doctor,locals);
  service.sendmail(doctor.firstName + ' ' + doctor.lastName, doctor.email, 'New Doctor Signup', html, callback);
};

exports.sendMail = sendMail;