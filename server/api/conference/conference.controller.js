'use strict';

var _ = require('lodash');
var Conference = require('./conference.model');

// Get list of conferences
exports.index = function(req, res) {
  Conference.find({$query: {}, $orderby: { timestamp: -1 }},function (err, conferences) {
    if(err) { return handleError(res, err); }
    return res.json(200, conferences);
  });
};

// Get a single conference
exports.show = function(req, res) {
  Conference.findById(req.params.id, function (err, conference) {
    if(err) { return handleError(res, err); }
    if(!conference) { return res.send(404); }
    return res.json(conference);
  });
};

// Creates a new conference in the DB.
exports.create = function(req, res) {
  Conference.create(req.body, function(err, conference) {
    if(err) { return handleError(res, err); }
    return res.json(201, conference);
  });
};

// Updates an existing conference in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Conference.findById(req.params.id, function (err, conference) {
    if (err) { return handleError(res, err); }
    if(!conference) { return res.send(404); }
    var updated = _.merge(conference, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, conference);
    });
  });
};

// Deletes a conference from the DB.
exports.destroy = function(req, res) {
  Conference.findById(req.params.id, function (err, conference) {
    if(err) { return handleError(res, err); }
    if(!conference) { return res.send(404); }
    conference.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}