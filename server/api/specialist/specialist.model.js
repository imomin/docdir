'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SpecialistSchema = new Schema({
  name: String,
  url: String,
  description: String,
  active: {type:Boolean,"default":true},
});

module.exports = mongoose.model('Specialist', SpecialistSchema);