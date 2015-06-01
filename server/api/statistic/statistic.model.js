'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StatisticSchema = new Schema({
  _doctor : {type:Schema.Types.ObjectId, ref: 'Doctor'},
  _user: {type:Schema.Types.ObjectId, ref: 'User'},
  type: {type: String, enum: ['view', 'like', 'phone','website']},
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Statistic', StatisticSchema);