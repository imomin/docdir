'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.IP ||
            undefined,

  // Server port
  port:     process.env.PORT || 8443,

  // MongoDB connection options
  mongo: {
    uri:      process.env.MONGOHQ_URL || 
              process.env.MONGOLAB_URI || 
              'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/sugarlanddoctors' ||
              'mongodb://localhost/sugarlanddoctors'
  }
};