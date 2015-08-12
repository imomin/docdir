'use strict';

var _ = require('lodash');
var Doctor = require('./doctor.model');
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var stripe = require('stripe')('sk_test_4ZtRKcjoaZltF5ngEo3J4Pio');

// Get list of doctors
exports.index = function(req, res) {
  Doctor.find({}, '-salt -hashedPassword', function (err, doctors) {
    if(err) { return handleError(res, err); }
    return res.json(200, doctors);
  });
};

// Get a single doctor
exports.show = function(req, res) {
  Doctor.findById(req.params.id, '-salt -hashedPassword', function (err, doctor) {
    if(err) {return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    return res.json(doctor);
  });
};

// Get a single doctor by doctorId
exports.detail = function(req, res) {
  Doctor.findOne({doctorId: req.params.doctorId},'-salt -hashedPassword -stripeSubId -stripeCardId -stripeCustId', 
    function(err,doctor) {
      if (err) return next(err);
      if (!doctor) return res.json(404);
      doctor.getStatistics(doctor._id,function(err, data){
        if (err || !data){
          doctor.set('stats',{"website":0,"phone":0,"likes":0,"views":0,"_id":doctor._id}, { strict: false });
        }
        doctor.set('stats',data[0], { strict: false });
        res.json(doctor);
      });
    });
};

// Creates a new doctor in the DB.
exports.create = function(req, res) {
  Doctor.create(req.body, function(err, doctor) {
    if(err) { return handleError(res, err); }
    return res.json(201, {"_id":doctor._id});
  });
};

// Updates an existing doctor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Doctor.findById(req.params.id, {upsert: true}, function (err, doctor) {/*'-salt -hashedPassword',*/
    if (err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    var updated = _.merge(doctor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, doctor); //_.omit(doctor, ['salt','hashedPassword']);
    });
  });
};

// Deletes a doctor from the DB.
exports.destroy = function(req, res) {
  Doctor.findById(req.params.id, function (err, doctor) {
    if(err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    doctor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var doctorId = req.doctor._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Doctor.findById(doctorId, function (err, doctor) {
    if(doctor.authenticate(oldPass)) {
      doctor.password = newPass;
      doctor.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var doctorId = req.doctor._id;
  Doctor.findOne({
    _id: doctorId
  }, '-salt -hashedPassword', function(err, doctor) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!doctor) return res.json(401);
    res.json(doctor);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

/**
 * Upload Files
 */
exports.uploadFile = function (req, res, next) {
    var doctorId = req.params.id;
    var data = _.pick(req.body, 'type');
    var file = req.files.file;
    var tempPath = file.path;
    var uploadPath = __dirname + '/../../../client';
    var clientPath = '/assets/images' + '/' + doctorId;
    var uploadFile = '/' + uuid.v4() + '-'+ file.name;
    var dirPath = uploadPath + clientPath;

    ensureExists(dirPath, parseInt('0744',8), function(err) {
      if(err){
        throw err;
      }
      else {
        fs.readFile(tempPath, function(err, data) {
          fs.writeFile(dirPath+uploadFile, data, function(err) {
            fs.unlink(tempPath, function(){
                if(err) throw err;
                  res.send(clientPath+uploadFile);
            });
          }); 
        }); 
      }
    });
};

exports.subscribe = function(req, res, next) {Doctor.findById(doctorId, {upsert: true}, function (err, doctor) {/*'-salt -hashedPassword',*/
    if (err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    var doctor = req.body;
    var token = doctor.token;//"tok_160OLAIfr2dTjlGD3C0tlYmT";
    var doctorId = doctor._id;//req.params.id;
    var subscriptionPlan = req.body.subscriptionType === "Yearly" ? "SugarlandDocYearly" : "sugarlandDocMonthly";
  
    var updatedData = _.merge(doctor, req.body);
    // CHECK IF STRIPECID EXISTS
    if(doctor.stripeCustId && doctor.stripeCustId.lenght > 0){
      stripe.customers.create({//create the customer
        email: updatedData.email,
        source: token
      }).then(function(customer) {
          updatedData.stripeCustId = customer.id;//save stripe customer id
          updatedData.stripeCardId = customer.default_source;
          return stripe.customers.createSubscription( //create subscription for the customer
                    customer.id,
                    {plan: subscriptionPlan}
                  );
      }).then(function(subscription) {//save subscription id.
        // New charge created on a new customer
          updatedData.stripeSubId = subscription.id;
          updatedData.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(200);
          });
      }, function(err) {
          // Deal with an error
          console.log(err);
          if(err) throw err;
      });
    }
    else {
      return handleError(res, "Already subscribed to " +  doctor.subscriptionType + " subscription.");
    }
  });
}
exports.changeSubscription = function(req, res, next) {
  var doctorId = req.params.id;
  var subscriptionPlan = req.body.subscriptionType === "Yearly" ? "SugarlandDocYearly" : "sugarlandDocMonthly";

  Doctor.findById(doctorId, {upsert: true}, function (err, doctor) {/*'-salt -hashedPassword',*/
    if (err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
      stripe.customers.updateSubscription(
        doctor.stripeCustId,
        doctor.stripeSubId,
        { plan: subscriptionPlan },
        function(err, subscription) {
          if (err) { return handleError(res, err); }
          doctor.subscriptionType = req.body.subscriptionType;
          doctor.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(200);
          });
        }
      );
  });
}

exports.unsubscribe = function(req, res, next) {
  var doctorId = req.params.id;
  Doctor.findById(doctorId, {upsert: true}, function (err, doctor) {/*'-salt -hashedPassword',*/
    if (err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
      stripe.customers.cancelSubscription(
        doctor.stripeCustId,
        doctor.stripeSubId,
        function(err, confirmation) {
          if (err) { return handleError(res, err); }
          doctor.active = false;
          doctor.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(200);
          });
        }
      );
  });
}

exports.contactInfo = function(req, res, next) {
  var doctorId = req.params.id;
  Doctor.findById(req.params.id, 'addresses', function (err, doctor) {
    if(err) {return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    var count = 0;
    var addressesLength = _.size(doctor.addresses);
    var contactInfo = {'_id':doctor._id,'addresses':[]};
    _.forEach(doctor.addresses,function(item, index){
        contactInfo.addresses.push({'_id':item._id,'phone': item.address.phone, 'fax': item.address.fax});
        count++;
        if(count >= addressesLength){
          return res.json(contactInfo);
        }
      });
      if(!doctor.addresses || addressesLength === 0){
        return res.json(200, contactInfo);
      }
  });
}

exports.list = function(req, res, next) {
  Doctor
    .find({})
    .where('specialist').equals(new RegExp('^' + req.params.specialist + '$','i'))
    .limit(100)
    .sort('-_id')
    .select('firstName lastName profilePicture credential specialist doctorId gender languages insurances _id')
    .exec(function (err, doctors) {
      if(err) { return handleError(res, err); }
      var recordCount = _.size(doctors);
      var statusAdded = 0;
      _.forEach(doctors,function(doctor, index){
        doctor.getStatistics(doctor._id,function(err, data){
          if (err || !data){
            doctor.set('stats',{"website":0,"phone":0,"likes":0,"views":0,"_id":doctor._id}, { strict: false });
          }
          doctor.set('stats',data[0], { strict: false });
          statusAdded++;
          if(recordCount === statusAdded){
            return res.json(200, doctors);
          }
        });
      });
      if(recordCount === 0){
        return res.json(200, doctors);
      }
    });
}
// db.users.find({name: /a/})  //like '%a%
// db.users.find({name: /^pa/}) //like 'pa%' 
// db.users.find({name: /ro$/}) //like '%ro'
// db.users.find({ $or: [{"firstName": /^Im/},{"lastName":/^Im/}]}) // firstName LIKE Im% OR lastName LIKE Im%
// db.users.find({ $or: [{"firstName": /^Im/},{"lastName":/^Im/}],"specialist":"Dentist"}) // (firstName LIKE Im% OR lastName LIKE Im%) AND Specialist = "Dentist"
exports.lookup = function(req, res, next) {
  var query = req.query.val ? escape(req.query.val) : null;
  var specialist = req.params.specialist ? req.params.specialist : null;
  if(!query){
    return res.json(200, {});
  }
  var regexp = new RegExp('^'+ query,'i');
  var findQuery = {$or:[{"firstName":regexp},{"lastName":regexp}]};
  if(specialist){
    findQuery.specialist = new RegExp('^' + specialist + '$','i');
  }

  Doctor
  .find(findQuery)
  .limit(10)
  .sort('-_id')
  .select('doctorId firstName lastName profilePicture credential specialist -_id')
  .exec(function (err, doctors) {
    if(err) { return handleError(res, err); }
    return res.json(200, doctors);
  });
}

exports.updateCard = function(req, res, next) {

  stripe.customers.updateCard(
    doctor.stripeCustId,
    doctor.stripeCardId,
    { name: "FirstName LastName" },
    function(err, card) {
      // asynchronously called
    }
  );
}

exports.resetPassword = function(req, res, next){
  Doctor.findOne({'email':req.params.email}, function (err, doctor) {
    if (err) return res.json(401, err);
    if (!doctor) return res.json(404, {message: 'EmailNotFound.'});
    doctor.password = Math.random().toString(36).substring(7);
    doctor.save(function(err) {
      if (err) return validationError(res, err);
      //SEND EMAIL MESSAGE WITH NEW PASSWORD.
      res.send(200);
    });
  });
}

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = parseInt('0777',8);
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}