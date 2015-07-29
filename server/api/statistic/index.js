'use strict';

var express = require('express');
var controller = require('./statistic.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/summary', controller.summary);
//router.post('/', controller.create);
router.post('/view', controller.create);
router.post('/like', controller.create);
router.post('/phone', controller.create);
router.post('/website', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;