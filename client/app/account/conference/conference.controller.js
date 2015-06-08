'use strict';

angular.module('sugarlandDoctorsApp')
	.controller('ConferenceCtrl', function ($scope, $timeout, Modal, Doctor, Auth) {
		$scope.userId = null;
		$scope.users = [];
		$scope.enableVideo = true;
		$scope.enableAudio = true;
		$scope.callStatus = null;
		$scope.isCameraConnected = false;
		$scope.isConnected = false;

		$scope.connect = function(){
			var username = prompt("Enter your username?");
			if (username != null) {
				username = easyrtc.cleanId(username);
				if (!easyrtc.setUsername(username) ){
	       			console.error("bad user name");
	   			}
	   			easyrtc.enableDataChannels(true);
				easyrtc.setRoomOccupantListener(function(roomName, list, selfInfo) {
					$scope.$apply(function(){
						$scope.users = [];
						for( var i in list ){
							$scope.users.push({
					            id: i,
					            name: list[i].username,
					            status: list[i].presence
					        });
						}
					});
				});
				easyrtc.connect("doctors",
	                  connectSuccessful,
	                  connectFailed);
				$scope.activateCamera();
			}
		}
		var connectSuccessful = function(easyRtcId, roomOwner) {
			$scope.userId = easyRtcId;
			var callerPending = null;
			//prompt user to join the call
			easyrtc.setAcceptChecker(function(easyrtcid, callback) {
			    callerPending = easyrtcid;
			    var confirmMessage = "";
			    if( easyrtc.getConnectionCount() > 0 ) {
			        confirmMessage = "Drop current call and accept new from " + easyrtc.idToName(easyrtcid) + " ?";
			    }
			    else {
			        confirmMessage = "Accept incoming call from " + easyrtc.idToName(easyrtcid) + " ?";
			    }
			    var accepted = confirm(confirmMessage);
			    if(accepted && easyrtc.getConnectionCount() > 0 ) {
					easyrtc.hangupAll();
			    }
			    callback(accepted);
			    callerPending = null;
			});

			//in case the requestor cancle the call before responding.
			easyrtc.setCallCancelled( function(easyrtcid){
			    if( easyrtcid === callerPending) {
			        //prompt ui
			        callerPending = false;
			        $scope.isConnected = false;
			    }
			});

			// easyrtc.setOnHangup( function(easyrtcid, slot) {
			// 	alert(easyrtc.idToName(easyrtcid) + " has hung up.");
			// });

			easyrtc.setStreamAcceptor(function(easyrtcid, stream) {
			    easyrtc.setVideoObjectSrc(document.getElementById('callerVideo'),stream);
			    $scope.callStatus = "connected with " + easyrtc.idToName(easyrtcid);
		    	$timeout(function(){$scope.isConnected = true;},0);
			});

			easyrtc.setOnStreamClosed(function(easyrtcid) {
			    easyrtc.setVideoObjectSrc(document.getElementById('callerVideo'), "");
			    $scope.callStatus =  easyrtc.idToName(easyrtcid) + " disconnect!";
			    $timeout(function(){$scope.isConnected = false;},0);
			});
		}
		var connectFailed = function(errorCode, errorText){
			alert(errorCode,errorText);
		}

		$scope.disconnect = function(){
			easyrtc.disconnect();
			easyrtc.clearMediaStream(document.getElementById('selfVideo'));
  			easyrtc.setVideoObjectSrc(document.getElementById("selfVideo"),"");
  			easyrtc.closeLocalMediaStream();
  			easyrtc.setRoomOccupantListener( function(){});
  			$scope.users = [];
  			$scope.isConnected = false;
  			$scope.isCameraConnected = false;
		}

		$scope.activateCamera = function(){
			easyrtc.initMediaSource(
	         function (){
				easyrtc.setVideoObjectSrc( document.getElementById("selfVideo"), easyrtc.getLocalStream());
				$scope.$apply(function(){
					$scope.isCameraConnected = true;
				});
	         },
	         function (){
	         	$scope.$apply(function(){
					$scope.isCameraConnected = true;
				});
	             alert("Unable to start webcam");
	         });
		}

		$scope.toggleVideoStream = function(){
			$scope.enableVideo = !$scope.enableVideo;
			easyrtc.enableCamera($scope.enableVideo);
		}
		$scope.toggleAudioStream = function(stream){
			$scope.enableAudio = !$scope.enableAudio;
			alert($scope.enableAudio);
			easyrtc.enableMicrophone($scope.enableAudio);
			easyrtc.enableAudio($scope.enableAudio);
		}

		$scope.callPeer = function(peerEasyRtcId) {
			if(!$scope.isCameraConnected){
				$scope.activateCamera();
			}
			$scope.callStatus = "waiting for response...";
			easyrtc.call(peerEasyRtcId,
		       function(easyrtcid, mediaType) {//success
		          $scope.callStatus = "connected with " + easyrtc.idToName(easyrtcid);
		       },
		       function(errorCode, errMessage) {//failed
		          $scope.callStatus = "call to  " + easyrtc.idToName(peerEasyRtcId) + " failed: " + errMessage;
		       },
		       function(wasAccepted, easyrtcid) {//accepted/rejected
		           if( wasAccepted ){
		              $scope.callStatus = "call accepted by " + easyrtc.idToName(easyrtcid);
		           }
		           else {
		               $scope.callStatus = "call rejected  by " + easyrtc.idToName(easyrtcid);
		           }
		       }
		    );
		}

		$scope.hangupCall = function(peerEasyRtcId){
			easyrtc.hangupAll();
			$scope.callStatus = null;
			$scope.isConnected = false;
		}
	});

