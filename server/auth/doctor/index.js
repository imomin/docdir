'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('doctor-local', function (err, doctor, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!doctor) return res.json(404, {message: 'Something went wrong, please try again.'});

    var token = auth.signToken(doctor._id);
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;