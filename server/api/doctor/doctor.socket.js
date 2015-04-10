/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Doctor = require('./doctor.model');

exports.register = function(socket) {
  Doctor.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Doctor.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('doctor:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('doctor:remove', doc);
}