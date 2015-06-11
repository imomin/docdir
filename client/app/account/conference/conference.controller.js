'use strict';

angular.module('sugarlandDoctorsApp')
	.controller('ConferenceCtrl', function ($rootScope, $scope, $state, $timeout, $location, Modal, Doctor, Auth) {
		$scope.userId = null;
		$scope.users = [];
		$scope.enableVideo = true;
		$scope.enableAudio = true;
		$scope.callStatus = null;
		$scope.isCameraConnected = false;
		$scope.isConnected = false;
		$scope.peerId = null;

		$scope.init = function(){
			$timeout(function(){
				easyrtc.enableDataChannels(true);
				easyrtc.dontAddCloseButtons();
				easyrtc.easyApp("SugarlandDoctors", "selfVideo", ["callerVideo"],
			         connectSuccessful,
			         connectFailed
			     );
			},100);

			if($state.params.conf){
				$scope.peerId = $state.params.conf;
			}
		}

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
			$scope.isCameraConnected = true;
			console.log(easyRtcId);
			angular.element($("#connectButton"))[0].style.display = "none";
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
			    		debugger;
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
  			$scope.isConnected = false;
  			$scope.isCameraConnected = false;
  			angular.element($("#disconnectButton"))[0].style.display = "none";
  			if(redirect){
  				$timeout(function(){
  					$location.path('/');
  				},100);
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
			alert($scope.enableAudio);
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
					$scope.message = "Call to  " + easyrtc.idToName($scope.peerId) + " failed: " + errMessage;
			        angular.element($("#callConfirmWaiting"))[0].style.display = "none";
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
	});

