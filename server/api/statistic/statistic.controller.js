'use strict';

var _ = require('lodash');
var Statistic = require('./statistic.model');
var mongoose = require('mongoose');

// Get list of statistics
exports.index = function(req, res) {
  Statistic.find(function (err, statistics) {
    if(err) { return handleError(res, err); }
    return res.json(200, statistics);
  });
};

// Get a single statistic
exports.show = function(req, res) {
  Statistic.findById(req.params.id, function (err, statistic) {
    if(err) { return handleError(res, err); }
    if(!statistic) { return res.send(404); }
    return res.json(statistic);
  });
};

// Get a single statistic
exports.summary = function(req, res) {
  getStats(req.params.id,function(err,statistics){
    if(err) { return handleError(res, err); }
    if(!statistics) { return res.send(404); }
    return res.json(statistics);
  });
};

// Creates a new statistic in the DB.
exports.create = function(req, res) {
  req.body.type = req.route.path.replace('/',"");
  Statistic.create(req.body, function(err, statistic) {
    if(err) { return handleError(res, err); }
    //return the summary;
    getStats(req.body._doctor,function(err,statistics){
      if(err) { return handleError(res, err); }
      if(!statistics) { return res.send(404); }
      return res.json(201, statistics);
    });
  });
};

// Delete like from the DB.
exports.unlike = function(req, res) {
  console.log(req.body);
  Statistic.findOne({_doctor:req.body._doctor,_user:req.body._user}, function(err, statistic) {
    if(err) { return handleError(res, err); }
    console.log(statistic);
    if (!statistic) return res.json(404);
    statistic.remove(function(err) {
      if(err) { return handleError(res, err); }
      //return the summary;
      getStats(req.body._doctor,function(err,statistics){
        if(err) { return handleError(res, err); }
        if(!statistics) { return res.send(404); }
        return res.json(201, statistics);
      });
    });
  });
};

// Updates an existing statistic in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Statistic.findById(req.params.id, function (err, statistic) {
    if (err) { return handleError(res, err); }
    if(!statistic) { return res.send(404); }
    var updated = _.merge(statistic, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, statistic);
    });
  });
};

// Deletes a statistic from the DB.
exports.destroy = function(req, res) {
  Statistic.findById(req.params.id, function (err, statistic) {
    if(err) { return handleError(res, err); }
    if(!statistic) { return res.send(404); }
    statistic.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function getStats(doctorId, callback) {
  Statistic.aggregate(
    { $match: { _doctor:new mongoose.Types.ObjectId(doctorId) } },
    { $project: {
        _id: 0,
        _doctor: 1,
        views: {$cond: [{$eq: ['$type', 'view']}, 1, 0]},
        likes: {$cond: [{$eq: ['$type', 'like']}, 1, 0]},
        phone: {$cond: [{$eq: ['$type', 'phone']}, 1, 0]},
        website: {$cond: [{$eq: ['$type', 'website']}, 1, 0]}
    }},
    { $group: {
        _id: "$_doctor",
        views: {$sum: '$views'},
        likes: {$sum: '$likes'},
        phone: {$sum: '$phone'},
        website: {$sum: '$website'}
    }}, function (err, statistics) {
        callback(err,statistics);
    });
}