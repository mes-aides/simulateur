#!/usr/bin/env node

var bodyParser = require('body-parser');
var morgan = require('morgan');
var utils = require('./backend/lib/utils');


module.exports = function(app) {

  // The request handler must be the first middleware on the app

  // Setup app
  app.use('/api', require('./backend/api'));

  app.use('/followups', require('./backend/followups'));

  app.use(bodyParser.urlencoded({ limit: '1024kb' }));


  app.set('trust proxy', true)



  if (app.get('env') == 'development') {
      app.use(morgan('dev'));
  } else {
      app.use(morgan('combined'));
  }
}
