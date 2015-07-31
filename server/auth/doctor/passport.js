var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (Doctor, config) {
  passport.use('doctor-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      Doctor.findOne({
        email: email.toLowerCase()
      }, function(err, doctor) {
        if (err) return done(err);
        if (!doctor) {
          return done(null, false, { message: 'InvalidEmailOrPassword' });
        }
        if (!doctor.authenticate(password)) {
          return done(null, false, { message: 'InvalidEmailOrPassword' });
        }
        return done(null, doctor);
      });
    }
  ));
};