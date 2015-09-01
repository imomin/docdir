'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConferenceSchema = new Schema({
  _doctor : {type:Schema.Types.ObjectId, ref: 'Doctor', required:true},
  webRTCSessionId: {type: String, required:false},
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conference', ConferenceSchema);