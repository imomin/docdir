'use strict';

var mail = require('../mail');

exports.index = function(req, res) {
	console.log("inside send email");
	console.log(req.body);
	mail.contactus.sendMail(req.body,function(err, info){
	    if(err) return res.send(500, err);
		return res.json(200, info);
	});
};
