'use strict';

angular.module('sugarlandDoctorsApp')
	.controller('ConferenceCtrl', function ($rootScope, $scope, $state, $timeout, $location, $http, Modal, Doctor, Auth, socket) {
		$scope.userId = null;
		$scope.users = [];
		$scope.enableVideo = true;
		$scope.enableAudio = true;
		$scope.callStatus = null;
		$scope.isCameraConnected = false;
		$scope.isConnected = false;
		$scope.peerId = null;
		$scope.isEndUser = false;

	    var addConference = function(webRTCSessionId) {
			if(!$scope.isEndUser){
				$http.post('/api/conferences', { _doctor:Auth.getCurrentDoctor()._id, webRTCSessionId:webRTCSessionId })
		      	.success(function(data, status){
		      		$scope.myConference = data;
		      	});
			}
	    };

	    var removeConference = function(conference) {
			if(!$scope.isEndUser){
				$http.delete('/api/conferences/' + conference._id);
			}
	    };

		$scope.init = function(){
			if($state.params.conf){
				$scope.peerId = $state.params.conf;
				$scope.isEndUser = true;
			}
			$timeout(function(){
				var username;
				if($scope.isEndUser){
					username = Auth.getCurrentUser().name;
					username = easyrtc.cleanId(username);
					easyrtc.setUsername(username);
					$scope.connect()
				}
				else {
					var doctor = Auth.getCurrentDoctor()
					username = doctor.firstName + ' ' + doctor.lastName;
					username = easyrtc.cleanId(username);
				}
			},100);
		}

		$scope.connect = function(){
			easyrtc.enableDataChannels(true);
			easyrtc.dontAddCloseButtons();
			easyrtc.easyApp("SugarlandDoctors", "selfVideo", ["callerVideo"],
		         connectSuccessful,
		         connectFailed
		     );
		}
		var connectSuccessful = function(easyRtcId, roomOwner) {
			$scope.userId = easyRtcId;
			var callerPending = null;
			$scope.isCameraConnected = true;
			addConference(easyRtcId);
			$timeout(function(){
				angular.element($("#connectButton"))[0].style.display = "none";
				angular.element($("#disconnectButton"))[0].style.display = "block";
			},0);
			//prompt user to join the call
			easyrtc.setAcceptChecker(function(easyrtcid, callback) {
			    callerPending = easyrtcid;
			    angular.element($("#callConfirm"))[0].style.display = "block";
			    $scope.confirmMessage = "";
			    if( easyrtc.getConnectionCount() > 0 ) {
			        $scope.confirmMessage = "Drop current call and accept " + easyrtc.idToName(easyrtcid) + "'s conference call?";
			    }
			    else {
			        $scope.confirmMessage = easyrtc.idToName(easyrtcid) + " has requested a conference call?";
			    }
			    $scope.$apply();
			    var acceptTheCall = function(accepted) {
					angular.element($("#callConfirm"))[0].style.display = "none";
				    if( accepted && easyrtc.getConnectionCount() > 0 ) {
				        easyrtc.hangupAll();
				    }
				    callback(accepted);
				    callerPending = null;
				};
				angular.element($("#confirmAccept"))[0].onclick = function() {
				    acceptTheCall(true);
				};
				angular.element($("#confirmReject"))[0].onclick =function() {
				    acceptTheCall(false);
				};
			});

			//in case the requestor cancle the call before responding.
			easyrtc.setCallCancelled( function(easyrtcid){
			    if( easyrtcid === callerPending) {
			        //prompt ui
			        angular.element($("#callConfirm"))[0].style.display = "none";
			        callerPending = false;
			        $scope.isConnected = false;
			    }
			});

			easyrtc.setOnCall( function(easyrtcid, slot) {
			});
			easyrtc.setOnHangup( function(easyrtcid, slot) {
				$timeout(function(){
					$scope.notification =  easyrtc.idToName(easyrtcid) + " has ended the conference call.";
			    	angular.element($("#callNotification"))[0].style.display = "block";
			    	
				},100);
			});

			easyrtc.setStreamAcceptor(function(easyrtcid, stream) {
			    easyrtc.setVideoObjectSrc(document.getElementById('callerVideo'),stream);
			    $scope.callStatus = "connected with " + easyrtc.idToName(easyrtcid);
		    	$timeout(function(){$scope.isConnected = true;},0);
			});

			easyrtc.setOnStreamClosed(function(easyrtcid) {
			    easyrtc.setVideoObjectSrc(document.getElementById('callerVideo'), "");
			    //replace this with easyrtc.setOnHangUp when its available without having to use easyrtc.EasyApp(...)
			    $timeout(function(){
			    	$scope.isConnected = false;
			    	$scope.notification = " The conference call has ended.";
			    	angular.element($("#callNotification"))[0].style.display = "block";
			    	angular.element($("#callNotificationBtn"))[0].onclick = function(){
			    		$('#callNotification')[0].style.display='none';
			    		$scope.disconnect(true);
			    	};
			    },0);
			});

			if($scope.peerId){
				$scope.callPeer();
			}
		}
		var connectFailed = function(errorCode, errorText){
			//show connect button.
			angular.element($("#connectButton"))[0].style.display = "block";
			angular.element($("#disconnectButton"))[0].style.display = "none";
			$scope.disconnect(false);
			
			//alert(errorCode,errorText);
		}

		$scope.disconnect = function(redirect){
			easyrtc.disconnect();
			easyrtc.clearMediaStream(document.getElementById('selfVideo'));
  			easyrtc.setVideoObjectSrc(document.getElementById("selfVideo"),"");
  			easyrtc.closeLocalMediaStream();
  			easyrtc.setRoomOccupantListener( function(){});
  			$scope.users = [];
  			removeConference($scope.myConference);
  			$scope.isConnected = false;
  			$scope.isCameraConnected = false;
  			angular.element($("#disconnectButton"))[0].style.display = "none";
  			angular.element($("#connectButton"))[0].style.display = "block";
  			if(redirect){
  				$timeout(function(){
  					$location.path('/');
  				},100);
  			}
  			else {
  				$timeout(function(){
  					//hack until, I figure how to disconnect so that when it recorrect it fires success callback.
  					window.location.reload();
  				},0);
  			}
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
			easyrtc.enableMicrophone($scope.enableAudio);
			easyrtc.enableAudio($scope.enableAudio);
		}

		$scope.callPeer = function() {
			if($scope.peerId){
				if(!$scope.isCameraConnected){
					$scope.activateCamera();
				}
				$scope.callStatus = "waiting for response...";
				$scope.message = "";
				$scope.toName = easyrtc.idToName($scope.peerId);
				angular.element($("#callConfirmWaiting"))[0].style.display = "block";
				angular.element($("#redialButton"))[0].style.display = "none";
				easyrtc.call($scope.peerId,
			       function(easyrtcid, mediaType) {//success
			          $scope.callStatus = "connected with " + easyrtc.idToName(easyrtcid);
			          angular.element($("#callConfirmWaiting"))[0].style.display = "none";
			       },
			       function(errorCode, errMessage) {//failed
			       	$timeout(function(){
						$scope.notification = "Call failed, peer is no longer online.";
				        angular.element($("#callConfirmWaiting"))[0].style.display = "none";
				        angular.element($("#callNotification"))[0].style.display = "block";
				        angular.element($("#callNotificationBtn"))[0].onclick = function(){
					    		$('#callNotification')[0].style.display='none';
					    		$scope.notification = "";
					    		if($scope.peerId){
									angular.element($("#redialButton"))[0].style.display = "block";
								}
					    	};
			       	},0);
			       },
			       function(wasAccepted, easyrtcid) {//accepted/rejected
			           if( wasAccepted ){
			              $scope.callStatus = "call accepted by " + easyrtc.idToName(easyrtcid);
			              angular.element($("#callConfirmWaiting"))[0].style.display = "none";
			           }
			           else {
			               //$scope.message = toName +" did not accept the call.";
						$scope.notification = $scope.toName + " did not accept the call.";
						angular.element($("#callNotification"))[0].style.display = "block";
						angular.element($("#callConfirmWaiting"))[0].style.display = "none";
						angular.element($("#callNotificationBtn"))[0].onclick = function(){
				    		$('#callNotification')[0].style.display='none';
				    		if($scope.peerId){
								angular.element($("#redialButton"))[0].style.display = "block";
							}
				    	};
			            $scope.$apply();
			           }
			       }
			    );
			}
		}

		$scope.hangupCall = function(peerEasyRtcId){
			easyrtc.hangupAll();
			$scope.callStatus = null;
			$scope.isConnected = false;
			angular.element($("#callConfirmWaiting"))[0].style.display = "none";
			if($scope.peerId){
				angular.element($("#redialButton"))[0].style.display = "block";
			}
		}

		$rootScope.$on('$stateChangeStart', function (event, next, current, from) {
			if(from.name === "conference"){
				$scope.disconnect(false);
			}
		});

		$scope.fullscreen = function(){

		}

	    $scope.$on('$destroy', function () {
	      socket.unsyncUpdates('conference');
	    });

	});

