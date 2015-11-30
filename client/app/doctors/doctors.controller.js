'use strict';

angular.module('sugarlandDoctorsApp')
  .filter('filterDoctors', function () {
    return function (doctors, search, insurance, gender, language) {
      var filtered = [];
      search = search || '';
      var searchMatch = new RegExp(search, 'i');
      for (var i = 0; i < doctors.length; i++) {
        var doctor = doctors[i];
        var hasGenderMatched = false;
        var hasSearchMatched = false;
        var hasLanguageMatched = false;
        var hasInsuranceMatched = false;

        if(doctor.gender.toLowerCase() === gender.toLowerCase() || gender.toLowerCase() === 'both'){
          hasGenderMatched = true;
        }
        
        if (searchMatch.test(doctor.firstName) || searchMatch.test(doctor.lastName)) {
          hasSearchMatched = true;
        }

        if(_.indexOf(doctor.languages,language) !== -1) {
          hasLanguageMatched = true;
        }

        if(_.indexOf(doctor.insurances,insurance) !== -1){
          hasInsuranceMatched = true;
        }

        if(hasGenderMatched && hasSearchMatched && hasLanguageMatched && (hasInsuranceMatched || insurance === null || typeof insurance === "undefined")){
          filtered.push(doctor);
        }
      }
      return filtered;
    };
  })
  .controller('DoctorsCtrl', function ($rootScope,$scope,$state,$stateParams,$location,$timeout,$window,page,Modal,Auth,Doctor,CommonData,Statistic,preloadDataset,$compile) {
    $scope.languages = preloadDataset.getLanguages();
    $scope.insurances = preloadDataset.getInsurances();
    $scope.doctorId = 0;
    $scope.hasData = true;
    $scope.showMapMarkers = ($scope.hasData && (!$state.params.doctorId || $state.params.doctorId === ""));
    $scope.mapMarkers = [];
    var styleArray = [
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              { hue: "#ff5500" },
              { saturation: 50 }
            ]
          },{
            featureType: "landscape",
            elementType: "geometry",
            stylers: [
              { hue:"#00ff33",
                visibility: "on" }
            ]
          },{
            featureType: "water",
            elementType: "geometry",
            stylers: [
              { hue:"#0088ff",
                visibility: "on" }
            ]
          }
        ];
    var styledMap = new google.maps.StyledMapType(styleArray, {name: "Map"});
    $scope.form = {
        specialist: {'url':$state.current.data.specialist},
        gender:"both",
        language:"English",
        insurance: null
    };
    var mapOptions = "";
    var map = "";
    var mapOffice = "";

    $scope.contact = null;
    $scope.videoConference=Modal.confirm.startConference(function(message) { // callback when modal is confirmed
        $location.path("/user/login"); //will redirect to login page, make sure your controller is using $location
      });

    $scope.isLive = function(_id){
      var session = _.find($rootScope.conferenceSession, '_doctor',_id);
      return !!session;
    }

    $scope.startVideoConference = function(_id, name){
      var session = _.find($rootScope.conferenceSession, '_doctor',_id);
      if(session && !angular.isDefined(Auth.getCurrentUser()._id)) {
        $rootScope.redirectURL = $location.path();
        $scope.videoConference(name);
      }
      else {
        $state.go('conference', {conf: session.webRTCSessionId});
      }
    }

    var initMap = function(){
     if(document.getElementById('mapPreviewMarkers')){
        map = new google.maps.Map(document.getElementById('mapPreviewMarkers'), {
              center:new google.maps.LatLng(29.598387,-95.622404),
              zoom:12,
              mapTypeControl:true,
              mapTypeControlOptions: {
                mapTypeIds: ['map_style', google.maps.MapTypeId.SATELLITE]
              }});
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
      }
    }
    
    $scope.addAllMarkers = function() {
        for (var i = 0; i < $scope.mapMarkers.length; i++) {
          $scope.mapMarkers[i].setMap(null);
        }
        $scope.mapMarkers = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < $scope.doctors.length; i++) {
            var marker = new google.maps.Marker({
                              position: {'lat':$scope.doctors[i].latitude,'lng':$scope.doctors[i].longitude},
                              map: map,
                              animation: google.maps.Animation.DROP,
                              icon: '/assets/images/mapMarker.png'
                            });
            var infoWindow = new google.maps.InfoWindow({
              maxWidth: 250
            });

            (function (marker, data, $scope) {
                var content = '<div id="mapMarkerInfo'+data.doctorId+'"> '+
                                  '<div class="" style="float:left;"> '+
                                              '<img src="'+data.profilePicture+'" alt="'+data.firstName+' '+data.lastName+' '+data.credential+'" class="img-responsive img-circle" style="width:50px;height:50px;"/> '+
                                          '</div> '+
                                          '<div class="" style="padding-left: 65px;"> '+
                                              '<span class="name">'+data.firstName +' '+ data.lastName +' '+ data.credential +' </span><br/> '+
                                              '<span> <i class="fa fa-heart" style="color:red;"></i> '+data.stats.likes +' likes</span> '+
                                              '<span> <i class="fa fa-eye" style="color:#000;"></i> '+data.stats.views +' views</span> '+
                                              '<br><a style="text-decoration: none !important;" ui-sref=".detail({ doctorId:\''+data.doctorId+'\'})" ui-sref-opts="{reload: false, notify: true}">Profile</a>'+
                                          '</div> '+
                                          '<div class="clearfix"></div> '+
                                '</div>';

                google.maps.event.addListener(marker, "click", function (e) {
                  infoWindow.setContent(content);
                  infoWindow.open(map, marker);
                  $scope.$apply(function(){
                     $compile(document.getElementById("mapMarkerInfo"+data.doctorId))($scope);
                  });
                });
                bounds.extend(marker.getPosition());
              })(marker, $scope.doctors[i],$scope);
            $scope.mapMarkers.push(marker);
        }
        setTimeout(function() {
          google.maps.event.trigger(map, "resize");
          map.fitBounds(bounds);
      }, 100);
    }

    $scope.$on('$viewContentLoaded', function(event) {
       initMap();
    });

    $scope.specialists = preloadDataset.getSpecialists();
    $scope.form.specialist = _.find($scope.specialists, function(specialist) {
                                return specialist.url === $state.current.data.specialist;
                              });
      
      //$scope.form.specialist = $scope.form.specialist ? $scope.form.specialist : {'url':$state.current.data.specialist};
      $scope.$watch(
          "form.specialist",
          function( newValue, oldValue ) {
              // Ignore initial setup.
              if ( newValue === oldValue || !newValue ||  $state.current.parent === newValue.url) {
                  return;
              }

              $scope.form.specialist = newValue;
              $state.transitionTo($scope.form.specialist.url, $state.params, {
                reload: true, inherit: false, notify: false
              });
              // $state.go($scope.form.specialist.url, $state.params, {
              //   reload: false, inherit: false, notify: false
              // });
              $scope.loadData();
          }
      );

    $scope.loadData = function(){
      $scope.doctors = [];
      CommonData.listDoctors($scope.form.specialist.url).then( function(data) {
        $scope.doctors = data;
        $scope.hasData = $scope.doctors.length > 0 ? true : false;
        $scope.showMapMarkers = ($scope.hasData && (!$state.params.doctorId || $state.params.doctorId === ""));
        //if($scope.showMapMarkers){
          $scope.addAllMarkers();
        //}
      }).catch(function(err) {
        debugger;
      });
    }

    $scope.$on("$stateChangeSuccess", function updatePage(e) {
        if($state.current.data.specialist && $state.params.doctorId){
          Doctor.details({id:$state.current.data.specialist,controller:$state.params.doctorId},function(data){
            $scope.doctor = data;
            $scope.contact = null;
            $scope.showMapMarkers = ($scope.hasData && (!$state.params.doctorId || $state.params.doctorId === ""));
            $scope.hasLiked = _.indexOf(Auth.getCurrentUser().likes,$scope.doctor._id) !== -1;
            if($scope.doctor.addresses){
                setTimeout(function() {
                  var latlng = new google.maps.LatLng($scope.doctor.addresses[0].address.latitude, $scope.doctor.addresses[0].address.longitude);
                mapOffice = new google.maps.Map(document.getElementById('mapPreview'), {
                                center:latlng,
                                zoom:15,
                                mapTypeControl:true,
                                mapTypeControlOptions: {
                                  mapTypeIds: ['map_style', google.maps.MapTypeId.SATELLITE]
                                }});
                mapOffice.mapTypes.set('map_style', styledMap);
                mapOffice.setMapTypeId('map_style');
                var marker = new google.maps.Marker({
                            position: latlng,
                            map: mapOffice,
                            animation: google.maps.Animation.DROP,
                            icon: '/assets/images/mapMarker.png'
                          });
              }, 100);
                //}
            }
            $scope.contact = _.get($rootScope.doctorContact,$scope.doctor._id);
            $scope.slides = [];
            for (var i = 0; i < $scope.doctor.pictures.length; i++) {
              $scope.slides.push({
                'image': $scope.doctor.pictures[i],
                'text': ''
              });
            };
            //update page title
            page.setTitle('Sugar Land ' + ' ' + $scope.doctor.specialist + ' ' + $scope.doctor.firstName + ' ' +  $scope.doctor.lastName);
            Statistic.addViewCount(data._id);
          }.bind(this));
        }
        $scope.doctorId = $state.params.doctorId;
    });
    $scope.$on('mapInitialized', function(event, map) { 
      $scope.map = map;
      debugger;
    });

    $scope.modal=Modal.confirm.askToLogin(function(message) { // callback when modal is confirmed
        $rootScope.redirectURL = $location.path();
        $location.path("/user/login"); //will redirect to login page, make sure your controller is using $location
      });

    $scope.likeMe = function(){
      if(!angular.isDefined(Auth.getCurrentUser()._id)){
        var name = $scope.doctor.firstName + ' ' +  $scope.doctor.lastName;
        $scope.modal(name);
      }
      else {
        if($scope.hasLiked){
          Statistic.UnlikeDoctor($scope.doctor._id,Auth.getCurrentUser()._id, function(err, stats){
            if(angular.isObject(stats)){
              $scope.doctor.stats = stats[0];
              _.remove(Auth.getCurrentUser().likes, function(docId) {
                 return docId === stats[0]._id;
               });
              $scope.hasLiked = !$scope.hasLiked;
              _.each($scope.doctors,function(doctor, index){
                if(doctor._id === stats[0]._id){
                    doctor.stats = stats[0];
                    return false;
                }
              });
            }
          });
        }
        else {
          Statistic.addLikeCount($scope.doctor._id,Auth.getCurrentUser()._id, function(err, stats){
            $scope.doctor.stats = stats[0];
            Auth.getCurrentUser().likes.push(stats[0]._id);
            $scope.hasLiked = !$scope.hasLiked;
            _.each($scope.doctors,function(doctor, index){
              if(doctor._id === stats[0]._id){
                  doctor.stats = stats[0];
                  return false;
              }
            });
          });
        }
      }
    }

    $scope.showContactNumber = function(){
      Doctor.showContact({'id':$scope.doctor._id}, function(data) {
        $scope.contact =  data.addresses[0];
        $rootScope.doctorContact[data._id] = data.addresses[0];
      });
      Statistic.addPhoneCount($scope.doctor._id);
    }

    $scope.launchWebsite = function(){
      Statistic.addWebsiteCount($scope.doctor._id);
      $window.open('//'+$scope.doctor.website);
      return true;
    }

    $scope.loadData();
  });
