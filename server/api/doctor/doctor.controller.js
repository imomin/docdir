'use strict';

var _ = require('lodash');
var Doctor = require('./doctor.model');

// Get list of doctors
exports.index = function(req, res) {
  Doctor.find(function (err, doctors) {
    if(err) { return handleError(res, err); }
    return res.json(200, doctors);
  });
};

// Get a single doctor
exports.show = function(req, res) {
  Doctor.findById(req.params.id, function (err, doctor) {
    if(err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    return res.json(doctor);
  });
};

// Creates a new doctor in the DB.
exports.create = function(req, res) {
  Doctor.create(req.body, function(err, doctor) {
    if(err) { return handleError(res, err); }
    return res.json(201, {"_id":doctor._id});
  });
};

// Updates an existing doctor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Doctor.findById(req.params.id, function (err, doctor) {
    if (err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    var updated = _.merge(doctor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, doctor);
    });
  });
};

// Deletes a doctor from the DB.
exports.destroy = function(req, res) {
  Doctor.findById(req.params.id, function (err, doctor) {
    if(err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    doctor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var doctorId = req.doctor._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Doctor.findById(doctorId, function (err, doctor) {
    if(doctor.authenticate(oldPass)) {
      doctor.password = newPass;
      doctor.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var doctorId = req.doctor._id;
  Doctor.findOne({
    _id: doctorId
  }, '-salt -hashedPassword', function(err, doctor) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(doctor);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};