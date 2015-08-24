'use strict';

var _ = require('lodash');
var Statistic = require('./statistic.model');
var mongoose = require('mongoose');
var moment = require('moment');

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

exports.viewByHours = function(req, res){
    Statistic.aggregate(
      { $match: { _doctor:new mongoose.Types.ObjectId(req.params.id)}},
      { $project: {
          _id: 0,
          timestamp: 1,
          views: {$cond: [{$eq: ['$type', 'view']}, 1, 0]},
          likes: {$cond: [{$eq: ['$type', 'like']}, 1, 0]},
          phone: {$cond: [{$eq: ['$type', 'phone']}, 1, 0]},
          website: {$cond: [{$eq: ['$type', 'website']}, 1, 0]}
      }},
      { $group: {
          _id: { hour: { $hour: "$timestamp" } },
          views: {$sum: '$views'},
          likes: {$sum: '$likes'},
          phone: {$sum: '$phone'},
          website: {$sum: '$website'}
      }}, function (err, statistics) {
          if(err) { return handleError(res, err); }
          if(!statistics) { return res.send(404); }
          var hoursOfTheDay = [{hour:0,label:"12AM",views:0,likes:0,phone:0,website:0},
                              {hour:1,label:"1AM",views:0,likes:0,phone:0,website:0},
                              {hour:2,label:"2AM",views:0,likes:0,phone:0,website:0},
                              {hour:3,label:"3AM",views:0,likes:0,phone:0,website:0},
                              {hour:4,label:"4AM",views:0,likes:0,phone:0,website:0},
                              {hour:5,label:"5AM",views:0,likes:0,phone:0,website:0},
                              {hour:6,label:"6AM",views:0,likes:0,phone:0,website:0},
                              {hour:7,label:"7AM",views:0,likes:0,phone:0,website:0},
                              {hour:8,label:"8AM",views:0,likes:0,phone:0,website:0},
                              {hour:9,label:"9AM",views:0,likes:0,phone:0,website:0},
                              {hour:10,label:"10AM",views:0,likes:0,phone:0,website:0},
                              {hour:11,label:"11AM",views:0,likes:0,phone:0,website:0},
                              {hour:12,label:"12AM",views:0,likes:0,phone:0,website:0},
                              {hour:13,label:"1PM",views:0,likes:0,phone:0,website:0},
                              {hour:14,label:"2PM",views:0,likes:0,phone:0,website:0},
                              {hour:15,label:"3PM",views:0,likes:0,phone:0,website:0},
                              {hour:16,label:"4PM",views:0,likes:0,phone:0,website:0},
                              {hour:17,label:"5PM",views:0,likes:0,phone:0,website:0},
                              {hour:18,label:"6PM",views:0,likes:0,phone:0,website:0},
                              {hour:19,label:"7PM",views:0,likes:0,phone:0,website:0},
                              {hour:20,label:"8PM",views:0,likes:0,phone:0,website:0},
                              {hour:21,label:"9PM",views:0,likes:0,phone:0,website:0},
                              {hour:22,label:"10PM",views:0,likes:0,phone:0,website:0},
                              {hour:23,label:"11PM",views:0,likes:0,phone:0,website:0}];
            _.forEach(hoursOfTheDay,function(hourData, index){
              var viewCount = _.findWhere(statistics,{"_id":{"hour":hourData.hour}});
              hourData.views =  viewCount ? viewCount.views : 0;
              hourData.likes =  viewCount ? viewCount.likes : 0;
              hourData.phone =  viewCount ? viewCount.phone : 0;
              hourData.website =  viewCount ? viewCount.website : 0;
            });
          return res.json(hoursOfTheDay);
      });
};

exports.viewByMonths = function(req, res){
    Statistic.aggregate(
      { $match: { _doctor:new mongoose.Types.ObjectId(req.params.id)}},
      { $project: {
          _id: 0,
          timestamp: 1,
          views: {$cond: [{$eq: ['$type', 'view']}, 1, 0]},
          likes: {$cond: [{$eq: ['$type', 'like']}, 1, 0]},
          phone: {$cond: [{$eq: ['$type', 'phone']}, 1, 0]},
          website: {$cond: [{$eq: ['$type', 'website']}, 1, 0]}
      }},
      { $group: {
          _id: { month: { $month: "$timestamp" } },
          views: {$sum: '$views'},
          likes: {$sum: '$likes'},
          phone: {$sum: '$phone'},
          website: {$sum: '$website'}
      }}, function (err, statistics) {
          if(err) { return handleError(res, err); }
          if(!statistics) { return res.send(404); }
          var monthOfYear = [{month:0,label:"Jan",views:0,likes:0,phone:0,website:0},
                              {month:1,label:"Feb",views:0,likes:0,phone:0,website:0},
                              {month:2,label:"Mar",views:0,likes:0,phone:0,website:0},
                              {month:3,label:"Apr",views:0,likes:0,phone:0,website:0},
                              {month:4,label:"May",views:0,likes:0,phone:0,website:0},
                              {month:5,label:"Jun",views:0,likes:0,phone:0,website:0},
                              {month:6,label:"Jul",views:0,likes:0,phone:0,website:0},
                              {month:7,label:"Aug",views:0,likes:0,phone:0,website:0},
                              {month:8,label:"Sep",views:0,likes:0,phone:0,website:0},
                              {month:9,label:"Oct",views:0,likes:0,phone:0,website:0},
                              {month:10,label:"Nov",views:0,likes:0,phone:0,website:0},
                              {month:11,label:"Dec",views:0,likes:0,phone:0,website:0},];
          _.forEach(monthOfYear,function(monthData, index){
            var viewCount = _.findWhere(statistics,{"_id":{"month":monthData.month}});
            monthData.views =  viewCount ? viewCount.views : 0;
            monthData.likes =  viewCount ? viewCount.likes : 0;
            monthData.phone =  viewCount ? viewCount.phone : 0;
            monthData.website =  viewCount ? viewCount.website : 0;
          });
          return res.json(monthOfYear);
      });
};

exports.viewByDays = function(req, res){
    Statistic.aggregate(
      { $match: { _doctor:new mongoose.Types.ObjectId(req.params.id)}},
      { $project: {
        _id: 0,
        timestamp: 1,
        views: {$cond: [{$eq: ['$type', 'view']}, 1, 0]},
        likes: {$cond: [{$eq: ['$type', 'like']}, 1, 0]},
        phone: {$cond: [{$eq: ['$type', 'phone']}, 1, 0]},
        website: {$cond: [{$eq: ['$type', 'website']}, 1, 0]}
    }},
    { $group: {
        _id: { dayOfWeek: { $dayOfWeek: "$timestamp" } },
        views: {$sum: '$views'},
        likes: {$sum: '$likes'},
        phone: {$sum: '$phone'},
        website: {$sum: '$website'}
    }}, function (err, statistics) {
          if(err) { return handleError(res, err); }
          if(!statistics) { return res.send(404); }
          console.log(statistics);
          var daysOfWeek = [{day:0,label:"Mon",views:0,likes:0,phone:0,website:0},
                              {day:1,label:"Tue",views:0,likes:0,phone:0,website:0},
                              {day:2,label:"Wed",views:0,likes:0,phone:0,website:0},
                              {day:3,label:"Thu",views:0,likes:0,phone:0,website:0},
                              {day:4,label:"Fri",views:0,likes:0,phone:0,website:0},
                              {day:5,label:"Sat",views:0,likes:0,phone:0,website:0},
                              {day:6,label:"Sun",views:0,likes:0,phone:0,website:0}];
          _.forEach(daysOfWeek,function(dayData, index){
            var viewCount = _.findWhere(statistics,{"_id":{"dayOfWeek":dayData.day}});
            dayData.views =  viewCount ? viewCount.views : 0;
            dayData.likes =  viewCount ? viewCount.likes : 0;
            dayData.phone =  viewCount ? viewCount.phone : 0;
            dayData.website =  viewCount ? viewCount.website : 0;
          });
          return res.json(daysOfWeek);
      });
};

exports.summaryByPeriod = function(req, res){
  getStatsByPeriod(req.params.id, req.params.period, function(err,statistics){
    if(err) { return handleError(res, err); }
    if(!statistics) { return res.send(404); }
    return res.json(statistics);
  });
};

exports.getDoctors = function(req, res){
  Statistic.aggregate(
    { $match: { type:'view' } },
    { $project: {
        _id: 0,
        _doctor: 1,
        views: {$cond: [{$eq: ['$type', 'view']}, 1, 0]}
    }},
    { $group: {
        _id: "$_doctor",
        views: {$sum: '$views'}
    }}, 
    {$sort: {views: 1}},
    {$limit: 12},
    function (err, doctors) {// THERE HAS TO BE BETTER WAY OF GETTING JOIN DATA.
      if(err) { return handleError(res, err); }
      var Doctor = mongoose.model('Doctor');
      var doctorIds = _.pluck(doctors, '_id');
      Doctor.find({'_id': { $in:doctorIds}}, 'firstName lastName profilePicture credential specialist doctorId _id', function (err, doctors) {
          if(err) { return handleError(res, err); }
          return res.json(doctors);
      });
      //callback(err,doctors);
    });
}

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


function get7DaysStats(doctorId, callback){
  var dateFilter = new Date();
  dateFilter.setDate(dateFilter.getDate()-7);

  Statistic.aggregate(
    { $match: { _doctor:new mongoose.Types.ObjectId(doctorId), timestamp: {"$lte": new Date(dateFilter)} } },
    { $project: {
        _id: 0,
        timestamp: 1,
        views: {$cond: [{$eq: ['$type', 'view']}, 1, 0]},
        likes: {$cond: [{$eq: ['$type', 'like']}, 1, 0]},
        phone: {$cond: [{$eq: ['$type', 'phone']}, 1, 0]},
        website: {$cond: [{$eq: ['$type', 'website']}, 1, 0]}
    }},
    { $group: {
        _id : { month: { $month: "$timestamp" }, day: { $dayOfMonth: "$timestamp" }, year: { $year: "$timestamp" } },
        views: {$sum: '$views'},
        likes: {$sum: '$likes'},
        phone: {$sum: '$phone'},
        website: {$sum: '$website'}
    }}, function (err, statistics) {
        callback(err,statistics);
    });
}

//7 days, 30 days, 90 days, 180 days, 365 days, all) 
function getStatsByPeriod(doctorId, period, callback) {
  var startDate = new Date();
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
  var endDate = new Date();
      endDate.setHours(0);
      endDate.setMinutes(0);
      endDate.setSeconds(0);
      endDate.setMilliseconds(0);
  var days = [];
  var daysCounter = 1;

  if(period === 'week'){
     startDate.setDate(startDate.getDate()-7);
  } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth()-1);
  } else if (period === '3months') {
      startDate.setMonth(startDate.getMonth()-3);
  } else if (period === '6months') {
      startDate.setMonth(startDate.getMonth()-6);
  } else if (period === 'year') {
      startDate.setYear(startDate.getYear()-1);
  } else {
      startDate = new Date('1/1/2015');
  }

  for (var d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    days.push({day:daysCounter++,label:moment(d).format("YYYY-MM-DD"),views:0,likes:0,phone:0,website:0})
  };
  
  Statistic.aggregate(
    { $match: { _doctor:new mongoose.Types.ObjectId(doctorId), timestamp: {"$gte": new Date(startDate)} } },
    { $sort : { timestamp : -1 } },
    { $project: {
        _id: 0,
        timestamp: 1,
        yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        views: {$cond: [{$eq: ['$type', 'view']}, 1, 0]},
        likes: {$cond: [{$eq: ['$type', 'like']}, 1, 0]},
        phone: {$cond: [{$eq: ['$type', 'phone']}, 1, 0]},
        website: {$cond: [{$eq: ['$type', 'website']}, 1, 0]}
    }},
    { $group: {
        _id : '$yearMonthDay',
        views: {$sum: '$views'},
        likes: {$sum: '$likes'},
        phone: {$sum: '$phone'},
        website: {$sum: '$website'}
    }}, function (err, statistics) {
        var endOfArray = days.length;
        _.forEach(days,function(dayData, index){
            var dateExists = _.findWhere(statistics,{"_id":dayData.label});
            if(dateExists){
              dayData.views = dateExists.views ? dateExists.views : 0;
              dayData.likes = dateExists.likes ? dateExists.likes : 0;
              dayData.phone = dateExists.phone ? dateExists.phone : 0;
              dayData.website =  dateExists.website ? dateExists.website : 0;
            }
            endOfArray--;
          });
        if(endOfArray ===0) callback(err,days);
    });
}