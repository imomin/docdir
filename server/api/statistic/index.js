'use strict';

var express = require('express');
var auth = require('../../auth/auth.service');
var controller = require('./statistic.controller');

var router = express.Router();

// router.get('/', auth.isDoctorAuthenticated(), controller.index);
router.get('/doctors', controller.getDoctors);
router.get('/:id', controller.show);//auth.isDoctorAuthenticated(),
router.get('/:id/summary', controller.summary);//, auth.isDoctorAuthenticated()
router.get('/:id/:period/summaryByPeriod', controller.summaryByPeriod);//, auth.isDoctorAuthenticated()
router.get('/:id/viewbyhours', controller.viewByHours);//, auth.isDoctorAuthenticated()
router.get('/:id/viewbymonths', controller.viewByMonths);//, auth.isDoctorAuthenticated()
router.get('/:id/viewbydays', controller.viewByDays);//, auth.isDoctorAuthenticated()

//router.post('/', controller.create);
router.post('/view', controller.create);
router.post('/like', controller.create);
router.post('/unlike', controller.unlike);
router.post('/phone', controller.create);
router.post('/website', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;