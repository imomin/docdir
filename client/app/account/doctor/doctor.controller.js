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

    /*************File Upload Example *****************/
    var uploader = $scope.uploader = new FileUploader({
      url: '/api/doctors/'+ $scope.doctor._id +'/upload'
    });

    uploader.filters.push({
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
    uploader.onAfterAddingFile = function(item) {
        item.croppedImage = '';
        if($scope.uploader.queue.length > 1) {
          $scope.uploader.removeFromQueue(0);
        }
        var reader = new FileReader();
        reader.onload = function(event) {
          $scope.$apply(function(){
            item.image = event.target.result;
          });
        };
        reader.readAsDataURL(item._file);
      };
 
     
      uploader.onBeforeUploadItem = function(item) {
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
 
      uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
          //console.info('onWhenAddingFileFailed', item, filter, options);
      };
      uploader.onAfterAddingAll = function(addedFileItems) {
          //console.info('onAfterAddingAll', addedFileItems);
      };
      uploader.onProgressItem = function(fileItem, progress) {
          //console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function(progress) {
          //console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
          //console.info('onSuccessItem', fileItem, response, status, headers);
      };
      uploader.onErrorItem = function(fileItem, response, status, headers) {
          //console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function(fileItem, response, status, headers) {
          //console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function(fileItem, response, status, headers) {
          //console.info('onCompleteItem', fileItem, response, status, headers);
          $scope.picturePreview=false;
      };
      uploader.onCompleteAll = function() {
          //console.info('onCompleteAll');
      };

    /*************File Upload Example *****************/



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

  // .controller('fileUploadCtrl',function($scope, Auth, $state, FileUploader) {

  //   var uploader = $scope.uploader = new FileUploader({
  //       url: '/api/users/photo'
  //   });
 
  //   // FILTERS
 
  //   uploader.filters.push({
  //       name: 'imageFilter',
  //       fn: function(item /*{File|FileLikeObject}*/, options) {
  //           var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
  //           return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
  //       }
  //   });
 
  //   // CALLBACKS
 
  //   /**
  //    * Show preview with cropping
  //    */
  //   uploader.onAfterAddingFile = function(item) {
  //     // $scope.croppedImage = '';
  //     item.croppedImage = '';
  //     var reader = new FileReader();
  //     reader.onload = function(event) {
  //       $scope.$apply(function(){
  //         item.image = event.target.result;
  //       });
  //     };
  //     reader.readAsDataURL(item._file);
  //   };
 
  //   /**
  //    * Upload Blob (cropped image) instead of file.
  //    * @see
  //    *   https://developer.mozilla.org/en-US/docs/Web/API/FormData
  //    *   https://github.com/nervgh/angular-file-upload/issues/208
  //    */
  //   uploader.onBeforeUploadItem = function(item) {
  //     var blob = dataURItoBlob(item.croppedImage);
  //     item._file = blob;
  //   };
 
  //   /**
  //    * Converts data uri to Blob. Necessary for uploading.
  //    * @see
  //    *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
  //    * @param  {String} dataURI
  //    * @return {Blob}
  //    */
  //   var dataURItoBlob = function(dataURI) {
  //     var binary = atob(dataURI.split(',')[1]);
  //     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //     var array = [];
  //     for(var i = 0; i < binary.length; i++) {
  //       array.push(binary.charCodeAt(i));
  //     }
  //     return new Blob([new Uint8Array(array)], {type: mimeString});
  //   };
 
  //   uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
  //       console.info('onWhenAddingFileFailed', item, filter, options);
  //   };
  //   uploader.onAfterAddingAll = function(addedFileItems) {
  //       console.info('onAfterAddingAll', addedFileItems);
  //   };
  //   uploader.onProgressItem = function(fileItem, progress) {
  //       console.info('onProgressItem', fileItem, progress);
  //   };
  //   uploader.onProgressAll = function(progress) {
  //       console.info('onProgressAll', progress);
  //   };
  //   uploader.onSuccessItem = function(fileItem, response, status, headers) {
  //       console.info('onSuccessItem', fileItem, response, status, headers);
  //   };
  //   uploader.onErrorItem = function(fileItem, response, status, headers) {
  //       console.info('onErrorItem', fileItem, response, status, headers);
  //   };
  //   uploader.onCancelItem = function(fileItem, response, status, headers) {
  //       console.info('onCancelItem', fileItem, response, status, headers);
  //   };
  //   uploader.onCompleteItem = function(fileItem, response, status, headers) {
  //       console.info('onCompleteItem', fileItem, response, status, headers);
  //   };
  //   uploader.onCompleteAll = function() {
  //       console.info('onCompleteAll');
  //   };
 
  //   console.info('uploader', uploader);
  // })
;
