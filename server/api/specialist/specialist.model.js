'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SpecialistSchema = new Schema({
  name: {type: String, required: true},
  url: {type: String, lowercase: true, required: true},
  description: String,
  active: {type:Boolean,"default":true},
});

module.exports = mongoose.model('Specialist', SpecialistSchema);