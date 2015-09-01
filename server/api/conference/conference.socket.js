/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Conference = require('./conference.model');

exports.register = function(socket) {
  Conference.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Conference.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('conference:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('conference:remove', doc);
}