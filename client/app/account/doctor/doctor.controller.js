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

  .controller('doctorProfileCtrl', function ($rootScope, $scope, $state, Auth, $location, $animate, $timeout, FileUploader) {
    $scope.doctor = Auth.getCurrentDoctor();
    $scope.errors = {};
    $scope.currentIndex = 0;
    $scope.maxIndex = 2;
    $scope.direction = "rtl";
    $scope.nextIndex = 1;
    $scope.prevIndex = 0;
    $scope.calElements = {};
    $scope.doctor.subscriptionType = "monthly";
    $scope.subscriptionOptions = {"monthly":"$25 per month.","yearly":"$255 per year. You save 15%."};

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

    $rootScope.$on('$stateChangeStart', function (event, next, current) {
      if(next.data && next.data.index > -1){
        $scope.slide(next.data.index);
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

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.doctor.name,
          email: $scope.doctor.email,
          password: $scope.doctor.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

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
