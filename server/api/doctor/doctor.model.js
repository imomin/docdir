'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var DoctorSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, lowercase: true },
  phone: String,
  hashedPassword: String,
  salt: String,
  active: Boolean
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
      'lastName': this.lastName
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

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
DoctorSchema
  .pre('save', function(next) {
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
  }
};

module.exports = mongoose.model('Doctor', DoctorSchema);