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
            promise.then(function() {
              $animate.removeClass(element, 'shake');
            });
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

  .controller('doctorProfileCtrl', function ($rootScope, $scope, $state, $q, Auth, $location, $animate, $timeout, FileUploader) {
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
    $scope.doctor.subscriptionType = "monthly";
    $scope.subscriptionOptions = {"monthly":"$25 per month.","yearly":"$255 per year. You save 15%."};
    $scope.doctor.languages = $scope.doctor.languages && $scope.doctor.languages.length > 0 ? $scope.doctor.languages : ["English"];
    $scope.doctor.insurances = $scope.doctor.insurances && $scope.doctor.insurances.length > 0 ? $scope.doctor.insurances : []; 
    $scope.languages = ["Gujurati","Marathi","Lahnda","Afrikaans", "Arabic", "Azerbaijani", "Catalan", "German", "English", "Spanish", "Persian", "Armenian", "Albanian", "Bulgarian", "Bengali", "Bosnian", "French", "Burmese", "Bokmål", "Dutch", "Portuguese", "Czech", "Greek", "Croatian", "Haitian Creole", "Swahili", "Uyghur", "Chinese", "Danish", "Faroese", "Estonian", "Finnish", "Galician", "Guarani", "Georgian", "Ossetian", "Hebrew", "Hindi", "Hungarian", "Irish", "Indonesian", "Icelandic", "Italian", "Javanese", "Kannada", "Punjabi", "Sanskrit", "Sardinian", "Sundanese", "Tamil", "Telugu", "Urdu", "Japanese", "Kazakh", "Korean", "Luxembourgish", "Limburgish", "Lao", "Lithuanian", "Latvian", "Sinhala", "Malagasy", "Malay", "Maltese", "Nepali", "Nynorsk", "Norwegian", "Polish", "Sindhi", "Romanian", "Russian", "Slovak", "Slovenian", "Somali", "Serbian", "Swedish", "Tajik", "Thai", "Turkish", "Ukrainian", "Uzbek", "Vietnamese", "Welsh"];
    $scope.insurances = ["Aetna", "Blue Cross Blue Shield", "Cigna", "Coventry Health Care", "Humana", "MultiPlan", "UnitedHealthcare", "ODS Health Network", "Medicare", "Great West Healthcare", "Blue Cross", "Met-Life", "Ameritas", "Guardian", "UnitedHealthcare Dental", "DenteMax", "Delta Dental", "United Concordia", "Medicaid", "Principal Financial", "UniCare", "WellPoint", "Scott and White Health Plan", "Health Net", "USA H and W Network", "Evercare", "LA Care Health Plan", "AmeriGroup", "Kaiser Permanente", "HealthNet", "WellCare", "Railroad Medicare", "Regence BlueCross BlueShield ", "Molina", "PacifiCare", "Superior Health Plan", "Centene", "Sierra", "ValueOptions", "Anthem Blue Cross", "Beech Street Corporation", "Private Healthcare Systems", "TriCare", "Highmark Blue Cross Blue Shield", "Anthem", "Boston Medical Center Health Net Plan", "Presbyterian Healthcare Services", "Health First Health Plans", "Medical Universe", "Preferred Provider Organization of Midwest", "Magellan", "Medica Health Plans"];

    $scope.addresses = [];
    $scope.address = {};
    $scope.workDays = [{"name":"Sunday","isOpen":false,"open":null,"close":null},
        {"name":"Monday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Tuesday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Wednesday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Thursday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Friday","isOpen":true,"open":"9:00 AM","close":"6:00 PM"},
        {"name":"Saturday","isOpen":false,"open":null,"close":null}];

    //bind data from the database 
    if($scope.doctor.addresses && $scope.doctor.addresses.length > 0){
      $scope.addresses = $scope.doctor.addresses;
      if($scope.addresses.length > 0){
        $scope.address = $scope.addresses[0].address;
      }
      if($scope.addresses[0].workDays.length === 7){
        $scope.workDays = $scope.addresses[0].workDays;
      }
    }

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
    if($scope.workDays[index].isOpen){
      $scope.workDays[index].open = "9:00 AM";
      $scope.workDays[index].close = "6:00 PM";
    }
    else {
      $scope.workDays[index].open = null;
      $scope.workDays[index].close = null;
    }
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

  var geocoder = new google.maps.Geocoder();
  var lat = $scope.address.latitude ? $scope.address.latitude : 29.59842628970894;
  var lng = $scope.address.longitude ? $scope.address.longitude : -95.62241274584954;
  var latlng = new google.maps.LatLng(lat,lng);
  var mapOptions = {zoom: 13,center: latlng}
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
                position: latlng,
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

  .controller('doctorSignupCtrl', function($scope, Auth, $state, $window) {
      $scope.doctor = {};
      $scope.errors = {};

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

  .controller('doctorLoginCtrl',function($scope, Auth, $state) {
    $scope.doctor = {};
    $scope.errors = {};
    $scope.doctor.email = "imomin@gmail.com";
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

  .controller('photoUploadCtrl',function($scope, Auth, $state, FileUploader) {
      /*************File Upload Example *****************/
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
   
        photoUploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        photoUploader.onAfterAddingAll = function(addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };
        photoUploader.onProgressItem = function(fileItem, progress) {
            //console.info('onProgressItem', fileItem, progress);
        };
        photoUploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
        };
        photoUploader.onSuccessItem = function(fileItem, response, status, headers) {
            //console.info('onSuccessItem', fileItem, response, status, headers);
        };
        photoUploader.onErrorItem = function(fileItem, response, status, headers) {
            //console.info('onErrorItem', fileItem, response, status, headers);
        };
        photoUploader.onCancelItem = function(fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
        };
        photoUploader.onCompleteItem = function(fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
            //$scope.photoPreview=false;
        };
        photoUploader.onCompleteAll = function() {
            //console.info('onCompleteAll');
        };

      /*************File Upload Example *****************/

  })
  .controller('pictureUploadCtrl',function($scope, Auth, $state, FileUploader) {
      $scope.myInterval = 5000;

      /*************File Upload Example *****************/
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

      // CALLBACKS
   
      /**
       * Show preview with cropping
       */
        pictureUploader.onAfterAddingFile = function(item) {
          var reader = new FileReader();
          reader.onload = function(event) {
            $scope.$apply(function(){
              item.text = "blah";
              item.image = event.target.result;
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
   
        pictureUploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        pictureUploader.onAfterAddingAll = function(addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };
        pictureUploader.onProgressItem = function(fileItem, progress) {
            //console.info('onProgressItem', fileItem, progress);
        };
        pictureUploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
        };
        pictureUploader.onSuccessItem = function(fileItem, response, status, headers) {
            //console.info('onSuccessItem', fileItem, response, status, headers);
        };
        pictureUploader.onErrorItem = function(fileItem, response, status, headers) {
            //console.info('onErrorItem', fileItem, response, status, headers);
        };
        pictureUploader.onCancelItem = function(fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
        };
        pictureUploader.onCompleteItem = function(fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
            //$scope.photoPreview=false;
        };
        pictureUploader.onCompleteAll = function() {
            //console.info('onCompleteAll');
        };

      /*************File Upload Example *****************/

  })
;
