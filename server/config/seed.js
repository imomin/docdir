/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

//https://data.medicare.gov/data/physician-compare
//https://data.medicare.gov/Physician-Compare/National-Downloadable-File-Simplified-View/jcud-62jk
//http://www.bloomapi.com/api/npis/##############
/*
{
  "address":"3425 Highway 6",
  "address_extended":"Ste 101",
  "category_ids":[68],
  "category_labels":[["Healthcare","Chiropractors"]],
  "country":"us",
  "degrees":["DC"],
  "factual_id":"384332b6-8922-4433-be51-e39e67c42926",
  "fax":"(281) 980-1348",
  "gender":"Male",
  "hours":{
    "monday":[["9:00","18:00"]],
    "tuesday":[["9:00","18:00"]],
    "wednesday":[["9:00","18:00"]],
    "thursday":[["9:00","18:00"]],
    "friday":[["9:00","12:00"]]
  },
  "hours_display":"Mon-Thu 9:00 AM-6:00 PM; Fri 9:00 AM-12:00 PM",
  "insurances":["Aetna","Blue Cross Blue Shield","Cigna","Coventry Health Care","Humana","MultiPlan","UnitedHealthcare"],
  "languages":["English"],
  "latitude":29.591304,
  "locality":"Sugar Land",
  "longitude":-95.60194,"
  name":"Stephen A. Harris",
  "neighborhood":["Smada"],
  "npi_id":"1528075892",
  "postcode":"77478",
  "region":"TX",
  "tel":"(281) 980-1050",
  "tel_normalized":"2819801050",
  "website":"http://www.sugarlandhealthcenter.com"
}
*/


