'use strict';

var _ = require('lodash');
var Specialist = require('./specialist.model');

// Get list of specialists
exports.index = function(req, res) {
   Specialist
    .find({"active":true})
    .limit(100)
    .sort('name')
    .select('name url description -_id')
    .exec(function (err, specialist) {
      if(err) { return handleError(res, err); }
      return res.json(200, specialist);
    });
};

// Get a single specialist
exports.show = function(req, res) {
  Specialist.findById(req.params.id, function (err, specialist) {
    if(err) { return handleError(res, err); }
    if(!specialist) { return res.send(404); }
    return res.json(specialist);
  });
};

// Creates a new specialist in the DB.
exports.create = function(req, res) {
  Specialist.create(req.body, function(err, specialist) {
    if(err) { return handleError(res, err); }
    return res.json(201, specialist);
  });
};

// Updates an existing specialist in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Specialist.findById(req.params.id, function (err, specialist) {
    if (err) { return handleError(res, err); }
    if(!specialist) { return res.send(404); }
    var updated = _.merge(specialist, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, specialist);
    });
  });
};

// Deletes a specialist from the DB.
exports.destroy = function(req, res) {
  Specialist.findById(req.params.id, function (err, specialist) {
    if(err) { return handleError(res, err); }
    if(!specialist) { return res.send(404); }
    specialist.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}