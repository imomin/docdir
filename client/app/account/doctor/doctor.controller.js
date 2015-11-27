'use strict';

angular.module('sugarlandDoctorsApp')

  .directive('shakeThat', ['$animate', function($animate) {
    return {
      require: '^form',
      scope: {
        submit: '&',
        submitted: '='
      },
      link: function(scope, element, attrs, form) {
        // listen on submit event
        element.on('submit', function() {
          // tell angular to update scope
          scope.$apply(function() {
            // everything ok -> call submit fn from controller
            if (form.$valid) return scope.submit();
            // show error messages on submit
            scope.submitted = true;
            // shake that form
            var promise = $animate.addClass(element, 'shake');
            if(promise){//radomly I get primise is undefined.
              promise.then(function() {
                $animate.removeClass(element, 'shake');
              });
            }
          });
        });
      }
    }}])

  .directive('disableAnimation', function($animate){
      return {
          restrict: 'A',
          link: function($scope, $element, $attrs){
              $attrs.$observe('disableAnimation', function(value){
                  $animate.enabled(!value, $element);
              });
          }
      }
  })

  .directive('locationPredictions', [
    function() {
      return {
        restrict: 'EA',
        scope: { results: '=' },
        template: '<input type="text" class="form-control" placeholder="search for a location">',
        link: function(scope, iElement, iAttrs) {

          // Setup Google Auto-complete Service
          var googleMapsService = new google.maps.places.AutocompleteService();
          var el = angular.element(iElement.find('input'));

          // Fetch predictions based on query
          var fetch = function(query) {
            googleMapsService.getPlacePredictions({
              input: query
            }, fetchCallback);
          };

          // Display predictions to the user
          var fetchCallback = function(predictions, status) {

            if (status !== google.maps.places.PlacesServiceStatus.OK) {

              scope.$apply(function() {
                scope.results = [];
              })

              return;

            } else {

              scope.$apply(function() {
                scope.results = predictions;
              })
            }
          };


          // Refresh on every edit
          el.on('input', function() {
            var query = el.val();

            if (query && query.length >= 3) {

              fetch(query);

            } else {

              scope.$apply(function() {
                scope.results = [];
              });
            }
          });

        }
      }
    }
])

  .controller('doctorProfileCtrl', function ($rootScope, $scope, $state, $q, Auth, $location, $animate, $timeout, FileUploader,preloadDataset) {
    $scope.doctor = Auth.getCurrentDoctor();
    $scope.forms = {};
    $scope.errors = {};
    $scope.currentIndex = 0;
    $scope.maxIndex = 2;
    $scope.direction = "rtl";
    $scope.nextIndex = 1;
    $scope.prevIndex = 0;
    $scope.calElements = {};
    $scope.language = "";
    $scope.doctor.subscriptionType = "yearly";//default
    $scope.subscriptionOptions = {"monthly":"$25 per month.","yearly":"$255 per year. You save 15%."};
    $scope.doctor.languages = $scope.doctor.languages && $scope.doctor.languages.length > 0 ? $scope.doctor.languages : ["English"];
    $scope.doctor.insurances = $scope.doctor.insurances && $scope.doctor.insurances.length > 0 ? $scope.doctor.insurances : []; 
    $scope.languages =  preloadDataset.getLanguages(); 
    $scope.insurances = preloadDataset.getInsurances();
    $scope.doctor.pictures = $scope.doctor.pictures && $scope.doctor.pictures.length > 0 ? $scope.doctor.pictures : [];
    $scope.addresses = [];
    $scope.address = {};
    $scope.workDays = [{"name":"Sunday","isOpen":false,"open":null,"close":null},
        {"name":"Monday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Tuesday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Wednesday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Thursday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Friday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Saturday","isOpen":false,"open":null,"close":null}];


    $scope.open = function($event, elementOpened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.calElements[elementOpened] = !$scope.calElements[elementOpened];
    };
    $scope.dateOptions = {
       datepickerMode:"'year'",
       showWeeks:"false"
    };

    $scope.format = 'MM/dd/yyyy';

    if($state.current.url === '/signup/doctor'){
      $state.go('doctor.login');
    }

    $scope.submit = function(form) {
      if(form.$name === "forms.address"){
        if(form.$valid) {
          $scope.addAddressToList();
        }
        else {
          for(var index in form.$error.required) { 
              form.$error.required[index].$setDirty(true);
              form.$error.required[index].$setValidity('required',false);
          }
        }
      }
    }

    $scope.subscribe = function(status, response){
      if(response.error) {
        // there was an error. Fix it.
        $scope.subscriptionError = response.error.message;
      } else {
        // got stripe token, now charge it or smt
        $scope.doctor.token = response.id;
        Auth.subscribeDoctor($scope.doctor)
          .then(function(r){
            $state.go('doctor.finish');
          })
          .catch(function(err){
            $scope.subscriptionError = err.data;
          });
      }
    }

    $rootScope.$on('$stateChangeStart', function (event, next, current, from) {
      if(next.data && next.data.index > -1){
        $scope.slide(next.data.index);
        var formName = from.name.split(".")[from.name.split(".").length-1];
        if($scope.forms[formName] && $scope.forms[formName].$valid && $scope.forms[formName].$dirty){
          $scope.save();
        }
      }
    });

    $scope.slide = function(index){
      if($scope.currentIndex < index) {
        $scope.direction = "ltr";
      } 
      else {
        $scope.direction = "rtl";
      }
      $scope.currentIndex = index;
      $scope.nextIndex = $scope.currentIndex + 1 < $scope.maxIndex ? $scope.currentIndex + 1 : $scope.maxIndex;
      $scope.prevIndex = $scope.currentIndex - 1 <= 0 ? 0 : $scope.currentIndex - 1;

      angular.element('#myTab li').each(function(idx,item){
        if(idx <= $scope.currentIndex){
          angular.element(item).addClass("active");
        }
        else {
          angular.element(item).removeClass("active");
        }
      });
    }

    $scope.handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.uploadedProfilePicture=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };

    $timeout(function(){
      angular.element(document.querySelector('#fileInput')).on('change',$scope.handleFileSelect);
    },500);

     $scope.handleStripe = function(status, response){
      if(response.error) {
        // there was an error. Fix it.
      } else {
        // got stripe token, now charge it or smt
        token = response.id
      }
    }

    $scope.addLanguage = function($item, $model, $label) {
      if($label && $label.trim().length > 0 && $scope.doctor.languages.indexOf($label.trim()) === -1) {
        $scope.doctor.languages.push($label.trim());
        _.remove($scope.languages, function(n) {
          return n === $label;
        });
      }
    };

    $scope.removeLanguage = function(index) {
      $scope.languages.push($scope.doctor.languages[index]);
      $scope.doctor.languages.splice(index, 1);
    };
    $scope.syncLanguageList = function(){
      _.remove($scope.languages, function(n) {
        return $scope.doctor.languages.indexOf(n) > -1;
      });
    }
    $scope.syncLanguageList();


    $scope.addInsurance = function($item, $model, $label) {
      if($label && $label.trim().length > 0 && $scope.doctor.insurances.indexOf($label.trim()) === -1) {
        $scope.doctor.insurances.push($label.trim());
        _.remove($scope.insurances, function(n) {
          return n === $label;
        });
      }
    };
    $scope.removeInsurance = function(index) {
      $scope.insurances.push($scope.doctor.insurances[index]);
      $scope.doctor.insurances.splice(index, 1);
    };
    $scope.syncInsuranceList = function(){
      _.remove($scope.insurances, function(n) {
        return $scope.doctor.insurances.indexOf(n) > -1;
      });
    }
    $scope.syncInsuranceList();

    $scope.addAffiliation = function() {
      var affiliate =  $('#affiliation').val();
      if(affiliate && affiliate.trim().length > 0 && $scope.doctor.insurances.indexOf(affiliate.trim()) === -1) {
        $scope.doctor.affiliations.push(affiliate.trim());
      };
      $('#affiliation').val("");
    }
    $scope.removeAffiliation = function(index) {
      $scope.forms['additionalInformation'].$dirty = true;
      $scope.doctor.affiliations.splice(index, 1);
    };

    $scope.addPersonalInterest = function() {
      var personalInterest =  $('#interest').val();
      if(personalInterest && personalInterest.trim().length > 0 && $scope.doctor.personalInterests.indexOf(personalInterest.trim()) === -1) {
        $scope.doctor.personalInterests.push(personalInterest.trim());
      };
      $('#interest').val("");
    }
    $scope.removePersonalInterest = function(index) {
      $scope.forms['additionalInformation'].$dirty = true;
      $scope.doctor.personalInterests.splice(index, 1);
    };

    $scope.addEducation = function() {
      var degree =  $('#degree').val();
      var college =  $('#college').val();
      var yearGraduate =  $('#yearGraduate').val();
      var educationObj = {"degree":degree,"college":college,"yearGraduate":yearGraduate};

      if($scope.doctor.educations.indexOf(educationObj) === -1) {
        $scope.forms['education'].$dirty = true;
        $scope.doctor.educations.push(educationObj);
      };

      degree =  $('#degree').val("");
      college =  $('#college').val("");
      yearGraduate =  $('#yearGraduate').val("");
    }
    $scope.removeEducation = function(index) {
      $scope.forms['education'].$dirty = true;
      $scope.doctor.educations.splice(index, 1);
    };

    $scope.addBoardCertification = function() {
      var boardCertification =  $('#boardCertification').val();
      if(boardCertification && boardCertification.trim().length > 0 && $scope.doctor.boardCertifications.indexOf(boardCertification.trim()) === -1) {
        $scope.forms['education'].$dirty = true;
        $scope.doctor.boardCertifications.push(boardCertification.trim());
      };
      $('#boardCertification').val("");
    }
    $scope.removeBoardCertification = function(index) {
      $scope.forms['education'].$dirty = true;
      $scope.doctor.boardCertifications.splice(index, 1);
    };

    $scope.addProfessionalMemberships = function() {
      var professionalMembership =  $('#professionalMembership').val();
      if(professionalMembership && professionalMembership.trim().length > 0 && $scope.doctor.professionalMemberships.indexOf(professionalMembership.trim()) === -1) {
        $scope.forms['education'].$dirty = true;
        $scope.doctor.professionalMemberships.push(professionalMembership.trim());
      };
      $('#professionalMembership').val("");
    }
    $scope.removeProfessionalMembership = function(index) {
      $scope.forms['education'].$dirty = true;
      $scope.doctor.professionalMemberships.splice(index, 1);
    };

    $scope.save = function(){
      Auth.updateDoctor($scope.doctor)
      .then(function(){
      })
      .catch(function(err){
        console.log(err);
      });
    }

  $scope.toggleTimePicker = function(index){
    $timeout(function(){
      if($scope.workDays[index].isOpen){
        $scope.workDays[index].open = "9:00 AM";
        $scope.workDays[index].close = "6:00 PM";
      }
      else {
        $scope.workDays[index].open = null;
        $scope.workDays[index].close = null;
      }
    });
  }

  $scope.getLocation = function(query) {
    var deferred = $q.defer();
    // Setup Google Auto-complete Service
    var googleMapsService = new google.maps.places.AutocompleteService();
 
    // Fetch predictions based on query
    if (query && query.length >= 3) {
        googleMapsService.getPlacePredictions({
          input: query,
          sensor:false,
          region:'us'
        }, function(predictions, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              return deferred.resolve([]);// in case of error return nothing.
            } else {
              return deferred.resolve(predictions);
            }
          });
    } 
    else {
      return [];
    }
    return deferred.promise;
  }

  $scope.lat = 29.59842628970894;// default to hwy 6 & 59
  $scope.lng = -95.62241274584954;//
  //bind data from the database
  if($scope.doctor.addresses && $scope.doctor.addresses.length > 0){
    //$timeout(function(){
      $scope.addresses = $scope.doctor.addresses;
      $scope.address = $scope.addresses[0].address;
      if($scope.addresses[0].workDays.length === 7){
        $scope.workDays = $scope.addresses[0].workDays;
      }
      $scope.lat = $scope.address.latitude;
      $scope.lng = $scope.address.longitude;
    //},1000)
  }

  var geocoder = new google.maps.Geocoder();
  $scope.latlng = new google.maps.LatLng($scope.lat,$scope.lng);
  var mapOptions = {zoom: 13,center: $scope.latlng}
  var map;
  var marker;
  var addressItems = {street_number: null, route: null, locality: null, sublocality: null,
                    administrative_area_level_3: null, administrative_area_level_2: null,
                    administrative_area_level_1: null, country: null, postal_code:null, type: null};

  $scope.selectAddress = function($item, $model, $label){
    geocoder.geocode({'address': $item.description}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        for (var item in addressItems){
          for (var i = 0; i < results[0].address_components.length; i++) {
            var component = results[0].address_components[i];
            if (component.types.indexOf(item) !=-1) {
              addressItems[item] = component.long_name;
              break;
            }
          }
        }

        //randomly doesn't update view.
        $scope.$apply(function() {
          $scope.address.streetAddress = addressItems.street_number + ' ' + addressItems.route;
          $scope.address.city = addressItems.locality;
          $scope.address.state = addressItems.administrative_area_level_1;
          $scope.address.postalCode = addressItems.postal_code;
          $scope.address.latitude = results[0].geometry.location.A;
          $scope.address.longitude = results[0].geometry.location.F;

          $scope.forms['address']['suite'].$dirty = true;
          $scope.forms['address']['phone'].$dirty = true;
          $scope.forms['address']['fax'].$dirty = true;

        });

        map.setCenter(results[0].geometry.location);
        marker.setPosition(results[0].geometry.location);
        marker.setVisible(true);
        map.fitBounds(results[0].geometry.viewport);
      } else {
        alert('Problem populating the address.');
      }
    });
  }

  $scope.addAddressToList = function(){
    //validate form
    var addressRecord = {"address":$scope.address,"workDays":$scope.workDays};
    if($scope.addresses.length > 0){//for now lets just have one address.
      $scope.addresses[0] = addressRecord;
    }
    else {
      $scope.addresses.push(addressRecord);
    }
    $scope.doctor.addresses = $scope.addresses;
    $scope.save();
  }

  var initMap = function(){
    if(document.getElementById('mapPreview')){
        map = new google.maps.Map(document.getElementById('mapPreview'), mapOptions);
        marker = new google.maps.Marker({
                map: map,
                position: $scope.latlng,
                draggable: true
            });
        google.maps.event.addListener(marker, 'dragend', function(){
          //update the lat/lon based on the marker.
          $scope.$apply(function() {
            $scope.address.latitude = marker.getPosition().lat();
            $scope.address.longitude = marker.getPosition().lng();
          });
        });
    }
  }
  $scope.$on('$viewContentLoaded', function(event) {
     initMap();
  });
})

  .controller('doctorSignupCtrl', function($scope, $rootScope, Auth, $state, $window, preloadDataset) {
      $scope.doctor = {};
      $scope.errors = {};
      $scope.specialists = preloadDataset.getSpecialists(); //$rootScope._specialists;

      $scope.submit = function(form) {
        if(form.$valid) {
          Auth.createDoctor({
            firstName: $scope.doctor.firstName,
            lastName: $scope.doctor.lastName,
            email: $scope.doctor.email,
            phone: $scope.doctor.phone,
            password: $scope.doctor.password
          })
          .then( function() {
            // Account created, redirect to home
            $state.go('doctor.emailVerification');
          })
          .catch( function(err) {
            err = err.data;
            $scope.errors = {};
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity(error.message, false);
              $scope.errors[field] = error.message;
            });
          });
        }
      };
  })

  .controller('ResetDoctorPasswordCtrl', function($scope, Auth){
    $scope.errors = {};
    $scope.hasError = false;
    $scope.submit = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.resetDoctorPassword($scope.doctor.email)
        .then( function() {
          $scope.hasError = false;
          $scope.message = 'An email with a new password is sent.';
          $scope.doctor.email = '';
          $scope.form.$setPristine();
        })
        .catch( function(err) {
          $scope.hasError = true;
          $scope.message = 'Email not found.';
        });
      }
    };
  })

  .controller('doctorLoginCtrl',function($scope, Auth, $state) {
    $scope.doctor = {};
    $scope.errors = {};
    
    // method called from shakeThat directive
    $scope.submit = function(form) {
      if(form.$valid) {
        Auth.loginDoctor({
          email: $scope.doctor.email,
          password: $scope.doctor.password
        })
        .then( function() {
          // Logged in, redirect to home
         $state.go('doctor.profile.bio');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
          angular.element(form).addClass("shake");
          $state.go('doctor.login');
        });
      }
    };
  })

  .controller('doctorEmailConfirmCtrl',function($scope, Auth, $state) {
        Auth.confirmEmail($state.params.token)
        .then( function() {
          $state.go('doctor.profile.bio');
        })
        .catch( function(err) {
          debugger;
        });
    })

  .controller('photoUploadCtrl',function($scope, Auth, $state, FileUploader) {
      /*************File Upload Example *****************/
      $scope.photoPreview = false; 
      var photoUploader = $scope.photoUploader = new FileUploader({
        url: '/api/doctors/'+ $scope.doctor._id +'/upload'
      });

      photoUploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      });

      // CALLBACKS
      /**
       * Show preview with cropping
       */
      photoUploader.onAfterAddingFile = function(item) {
          item.croppedImage = '';
          if($scope.photoUploader.queue.length > 1) {
            $scope.photoUploader.removeFromQueue(0);
          }
          var reader = new FileReader();
          reader.onload = function(event) {
            $scope.$apply(function(){
              item.image = event.target.result;
            });
          };
          reader.readAsDataURL(item._file);
          $scope.picture = $scope.photoUploader.queue[0].croppedImage;
        };
   
       
        photoUploader.onBeforeUploadItem = function(item) {
          var blob = dataURItoBlob(item.croppedImage);
          item._file = blob;
        };
   
        var dataURItoBlob = function(dataURI) {
          var binary = atob(dataURI.split(',')[1]);
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
          var array = [];
          for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          return new Blob([new Uint8Array(array)], {type: mimeString});
        };
   
        photoUploader.onCompleteItem = function(fileItem, response, status, headers) {
            $scope.forms['profilePicture'].$dirty = true;
            $scope.doctor.profilePicture = response;
            $scope.save();
        };
      /*************File Upload Example *****************/

  })
  .controller('pictureUploadCtrl',function($scope, $timeout, Auth, $state, FileUploader) {
      $scope.slideInterval = 5000;
      $scope.officePictures = [];
      
      for(var index in $scope.doctor.pictures){
        $scope.officePictures.push({"server":true,"url":$scope.doctor.pictures[index]});
      }

      var pictureUploader = $scope.pictureUploader = new FileUploader({
        url: '/api/doctors/'+ $scope.doctor._id +'/upload'
      });

      pictureUploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      });

      $scope.remove = function(item){
        item.remove();
        $scope.officePictures.splice(item.pictureIndex, 1);
      }

      $scope.removeAll = function(){
        pictureUploader.clearQueue();
        $scope.officePictures = _.filter($scope.officePictures, function(item) {
                                    return item.server === true;
                                  });
      }

      $scope.removeOldPicture = function(index){
        var img = $scope.doctor.pictures[index];
        $scope.doctor.pictures.splice(index, 1);
        _.remove($scope.officePictures, function(item) {
          return item.url === img;
        });
        $scope.forms['pictures'].$dirty = true;
      }

      pictureUploader.onAfterAddingFile = function(item) {
        var reader = new FileReader();
        reader.onload = function(event) {
          $scope.$apply(function(){
            item.text = "";
            item.image = event.target.result;
            item.pictureIndex = $scope.officePictures.length;
            $scope.officePictures.push({"server":false,"url":item.image});
          });
        };
        reader.readAsDataURL(item._file);
      };
 
     
      pictureUploader.onBeforeUploadItem = function(item) {
        var blob = dataURItoBlob(item.image);
        item._file = blob;
      };
   
      var dataURItoBlob = function(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var array = [];
        for(var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: mimeString});
      };
 
      pictureUploader.onCompleteItem = function(fileItem, response, status, headers) {
          $scope.forms['pictures'].$dirty = true;
          $scope.doctor.pictures.push(response);
          //console.info('onCompleteItem', fileItem, response, status, headers);
          //$scope.photoPreview=false;
      };
      pictureUploader.onCompleteAll = function() {
          //console.info('onCompleteAll');
      };

      /*************File Upload Example *****************/

  })
;
