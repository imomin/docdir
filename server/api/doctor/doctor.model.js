'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var DoctorSchema = new Schema({
  doctorId: { type: String, lowercase: true, required: true, unique: true},
  firstName: String,
  lastName: String,
  email: { type: String, lowercase: true },
  phone: String,
  hashedPassword: String,
  salt: String,
  credential: String,
  dateOfBirth: Date,
  gender: String,
  bio: String,
  insurances: {type:[String],"default":[]},
  languages: {type:[String],"default":["English"]},
  specialist: String,
  educations: [{
    degree: {type:String, require:true},
    college: {type:String, require:true},
    yearGraduate: {type:Number, require:true},
  }],
  boardCertifications: {type:[String],"default":[]},
  professionalMemberships: {type:[String],"default":[]},
  website: String,
  affiliations: {type:[String],"default":[]},
  personalInterests: {type:[String],"default":[]},
  addresses: [{
    address: {
      streetAddress:{type:String},
      suite:{type:String},
      city:{type:String},
      state:{type:String},
      postalCode:{type:String},
      phone:{type:String},
      fax:{type:String},
      latitude:{type:Number},
      longitude:{type:Number}
    },
    workDays: [{
      name:{type:String},
      isOpen:{type:Boolean},
      open:{type:String},
      close:{type:String}
    }]
  }],
  pictures: {type:[String],"default":[]},
  profilePicture: String,
  subscriptionType: String,
  stripeCustId: String,
  stripeCardId: String,
  stripeSubId: String,
  active: Boolean,
  statistics: {type:Schema.Types.ObjectId, ref: 'Statistic'}
});

/**
 * Virtuals
 */
DoctorSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
DoctorSchema
  .virtual('profile')
  .get(function() {
    return {
      'firstName': this.firstName,
      'lastName': this.lastName,
      'profilePicture': this.profilePicture,
      'specialist': this.specialist,
      'credential': this.credential
    };
  });

// Non-sensitive info we'll be putting in the token
DoctorSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id
    };
  });

/**
 * Validations
 */

// Validate empty email
DoctorSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'blankEmail');

// Validate empty password
DoctorSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'blankPassword');

// Validate email is not taken
DoctorSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, doctor) {
      if(err) throw err;
      if(doctor) {
        if(self.id === doctor.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'duplicateEmail');

// Validate doctorId is not taken
DoctorSchema
  .path('doctorId')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({doctorId: value}, function(err, doctor) {
      if(err) throw err;
      if(doctor) {
        if(self.id === doctor.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'duplicateDoctorId');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
DoctorSchema
  .pre('save', function(next) {
    this.doctorId = this.createDoctorId(this.firstName,this.lastName,this.credential);
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('invalidPassword'));
    else
      next();
  });

/**
 * Methods
 */
DoctorSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  /**
   * Make URL string
   * @param {String} firstName, lastName, credentail
   * @return {String}
   * @api public
   */
   createDoctorId: function(firstName,lastName,credential){
      return firstName + '-' + lastName + '-' + credential;
   }
};

module.exports = mongoose.model('Doctor', DoctorSchema);