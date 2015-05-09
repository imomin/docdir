'use strict';

var express = require('express');
var controller = require('./doctor.controller');
var auth = require('../../auth/auth.service');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();


var router = express.Router();

router.get('/', controller.index);
router.get('/me', auth.isDoctorAuthenticated(), controller.me);
router.get('/:id', controller.show);
router.post('/:id/upload', multipartyMiddleware, controller.uploadFile);
router.put('/:id/subscribe', auth.isDoctorAuthenticated(), controller.subscribe);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
module.exports = router;




