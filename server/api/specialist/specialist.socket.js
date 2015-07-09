/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Specialist = require('./specialist.model');

exports.register = function(socket) {
  Specialist.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Specialist.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('specialist:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('specialist:remove', doc);
}