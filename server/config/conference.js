/**
 * Video Chat configuration
 */

'use strict';
var easyrtc = require("easyrtc");           // EasyRTC external module
module.exports = function(app, socketServer) {
	var rtc = easyrtc.listen(app, socketServer);
}