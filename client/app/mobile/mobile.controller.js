'use strict';

angular.module('sugarlandDoctorsApp')
	.filter('nospace', function () {
	      return function (value) {
	        return (!value) ? '' : value.replace(/ /g, '');
	      };
	    })
      .run(['$templateCache', function ($templateCache) {
      $templateCache.put('partials/menu-toggle.tmpl.html',
        '<md-button class="md-button-toggle" ng-class="{\'toggled\' : isOpen()}"\n' +
        '  ng-click="toggle()"\n' +
        '  aria-controls="docs-menu-{{section.name | nospace}}"\n' +
        '  flex layout="row"\n' +
        '  aria-expanded="{{isOpen()}}">\n' +
        '  {{section.name}}\n' +
        '  <md-icon md-font-set="fa fa-chevron-down" class="md-toggle-icon" ng-class="{\'toggled\' : isOpen()}"></md-icon>' +
        '</md-button>\n' +
        '<ul ng-show="isOpen()" id="docs-menu-{{section.name | nospace}}" class="menu-toggle-list">\n' +
        '  <li ng-repeat="page in section.pages">\n' +
        '    <menu-link section="page"></menu-link>\n' +
        '  </li>\n' +
        '</ul>\n' +
        '');
      $templateCache.put('partials/menu-link.tmpl.html',
        '<md-button ng-class="{\'{{section.icon}}\' : true}" \n' +
        '  ui-sref-active="active" ui-sref="{{section.state}}" ng-click="focusSection(section)">\n' +
        '  {{section | humanizeDoc}}\n' +
        '  <span class="md-visually-hidden "\n' +
        '    ng-if="isSectionSelected()">\n' +
        '    current page\n' +
        '  </span>\n' +
        '</md-button>\n' +
        '');
    }])
    .filter('humanizeDoc', function () {
      return function (doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
          return doc.name.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
          });
        }
        return doc.label || doc.name;
      };
    })
    .directive('menuLink', function () {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-link.tmpl.html',
        link: function ($scope, $element) {
          var controller = $element.parent().controller();

          $scope.focusSection = function (section) {
            // set flag to be used later when
            // $locationChangeSuccess calls openPage()
            controller.sideMenuLinkSelected(section);
          };
        }
      };
    })
 .directive('menuToggle', ['$timeout', function ($timeout ) {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-toggle.tmpl.html',
        link: function (scope, element) {
          var controller = element.parent().controller();

          scope.isOpen = function () {
            return controller.isOpen(scope.section);
          };
          scope.toggle = function () {
            controller.toggleOpen(scope.section);
          };
          
          var parentNode = element[0].parentNode.parentNode.parentNode;
          if (parentNode.classList.contains('parent-list-item')) {
            var heading = parentNode.querySelector('h2');
            element[0].firstChild.setAttribute('aria-describedby', heading.id);
          }
        }
      };
    }])
    .factory('menu',function ($location,specialistItems) {

        var sections =  [];
        sections.push({
          name: 'Menu',
          type: 'toggle',
          pages: [{
            name: 'Home',
            type: 'link',
            state: 'main.home',
            icon: 'fa fa-home'
          }, {
            name: 'Contact Us',
            state: 'main.contactus',
            type: 'link',
            icon: 'fa fa-envelope-o'
          }]
        });

        /*{
            name: 'Login',
            type: 'link',
            state: 'main.login',
            icon: 'fa fa-group'
          },*/
        
       	angular.forEach(specialistItems.get(),function(obj,index){
       		obj.type = 'link';
          obj.state = 'main.'+obj.url;
       		sections.push(obj);
       	});
        var self;

        return self = {
          sections: sections,
          toggleSelectSection: function (section) {
            self.openedSection = (self.openedSection === section ? null : section);
          },
          isSectionSelected: function (section) {
            return self.openedSection === section;
          },

          selectPage: function (section, page) {
            page && page.url && $location.path(page.url);
            self.currentSection = section;
            self.currentPage = page;
          }
        };

        function sortByHumanName(a, b) {
          return (a.humanName < b.humanName) ? -1 :
            (a.humanName > b.humanName) ? 1 : 0;
        }

      })
  .directive('mobileCarousel', [
      '$window', /* Inject $window so we can tap into resize events */
      function(
        $window
      ) {
        return {
          scope: true,
          slideCount: '=',
          link: function(scope, element, attrs, controller) {
            
            /* Initial reference to the carousel width. Set here on load */
            scope.carouselWidth = element.width();

            /* Width of the slide */
            scope.slideProperties = {};

            /* An object that will be used to update the styles of the carousel-wrapper */
            scope.wrapperProperties = {};
            
            /* Gutter is an attribute set on the carousel directive. A number should be assigned to the attribute to represent the space between slides and the overlap that will be seen of the next slide*/
            var gutter;
            if (typeof attrs.gutter !== 'undefined') {
              gutter = parseInt(attrs.gutter, 10);
            } else {
              gutter = 0;
            }

            /* Wrapper width is calculated using the number of slides and the carousel width. We use the carousel width and not the width of the slide because a slide should be 100% the width of the carousel container */
            var wrapperWidth = scope.slideCount * scope.carouselWidth;
            
            /* The width of a slide. This will be set and used in a $watch function*/
            var slideWidth = null;

            /* Reference to the number of pixels that the container is offset to the left */
            scope.wrapperLeft = null;
    
            scope.updateCurrentSlide = function(dir) {
              scope.updateCurrent(dir);
              updatePosition();
            };
           
            /**
             * Update Position
             *
             * This function updates the scope.weapperLeft value which is being
             * being monitored with a $watch function. This will trigger a slide
             * of the carousel
             */
            function updatePosition() {
              var currentMinusOne = scope.currentSlide - 1;
              scope.wrapperLeft = -1 * ((slideWidth * currentMinusOne) + (gutter * currentMinusOne) - gutter);
            }

            scope.$watch('slideCount', function(newValue, oldValue) {
                if (newValue){
                  wrapperWidth = newValue * scope.carouselWidth;
                  scope.wrapperLeft = null;
                }  
            });

            /**
             * Wrapper Left $watch
             *
             * This $watch function monitors the scope.wrapperLeft property
             * for changes. WHen it does change, scope.wrapperProperties
             * which controls the styles of the .carousel-wrapper.
             */
            scope.$watch('wrapperLeft', function(newValue, oldValue){ 
              scope.wrapperProperties = {
                'width': wrapperWidth + 'px',
                'left': newValue  + 'px'
              };
            });

            /**
             * Carousel Width $watch
             *
             * This $watch function monitors the scope.carouselWidth property
             * for changes. WHen it does change, scope.wrapperProperties
             * which controls the styles of the .carousel-wrapper.
             */
            scope.$watch('carouselWidth', function(newValue, oldValue){
              wrapperWidth = scope.slideCount * newValue; // Update the width of the wrapper
              slideWidth = newValue - (4 * gutter);       // Slide width minus gutter
              scope.slideProperties = {
                'width': slideWidth + 'px',
                'margin-left': gutter + 'px'
              };
              
              updatePosition(); // Update the position of the slider
            });

            /**
             * Window Resize
             *
             * This function acts as a resize listener on the window. 
             * On resize, the carouselWidth will be updated which will
             * kick off other $watch
             */
            angular.element($window).bind('resize', function(){
              scope.carouselWidth = element.width();
              scope.$digest();
            });
          }
        };
      }])

	.controller('MobileMainCtrl',function($scope, $mdSidenav, menu, mobileHeader){
		$scope.toggleSidenav = function(menuId) {
			$mdSidenav(menuId).toggle();
		};
    $scope.specialist = "Sugar Land Doctors";
		$scope.vm = this;
		$scope.vm.isOpen = isOpen;
		$scope.vm.toggleOpen = toggleOpen;
    $scope.vm.sideMenuLinkSelected = sideMenuLinkSelected;
		$scope.vm.autoFocusContent = false;
		$scope.vm.menu = menu;
    $scope.mobileHeader = mobileHeader;
    
		$scope.vm.status = {
			isFirstOpen: true,
			isFirstDisabled: false
		};

		function isOpen(section) {
			return menu.isSectionSelected(section);
		}

		function toggleOpen(section) {
			menu.toggleSelectSection(section);
		}

    function sideMenuLinkSelected(specialist) {
      $scope.vm.autoFocusContent = true;
      mobileHeader.setTitle(specialist.name);
      $mdSidenav('left').close()
          .then(function () {
            //some action if needed.
          });
    }
	})
  .controller('MobileListCtrl',function($scope, $state, Doctor, CommonData, $mdSidenav, menu, mobileHeader){//$rootScope,$scope,$state,$stateParams,$location,$timeout,$window,page,Modal,Auth,Doctor,CommonData
    mobileHeader.setTitle($state.current.data.name);
    CommonData.listDoctors($state.current.data.specialist).then( function(data) {
        $scope.doctors = data;
        if($scope.doctors.length > 0){
          $scope.hasData = true;
        }
        else {
          $scope.hasData = false;
        }
      }).catch(function(err) {
        //show Oops page.
      });
      $scope.goToDetails = function(doctorInfo){
        $state.params.doctorId = doctorInfo.doctorId;
        $state.go('main.' + $state.current.data.specialist+'.detail', $state.params , {
            reload: false, inherit: false, notify: true
          });
      }
  })
  .controller('MobileDetailCtrl',function($scope, $state, $mdSidenav, menu, Doctor, page, Statistic){
    $scope.slideCount = 0;
    Doctor.details({id:$state.current.data.specialist,controller:$state.params.doctorId},function(data){
      $scope.doctorInfo = data;
      $scope.slideData = $scope.doctorInfo.pictures;
      $scope.slideCount = $scope.slideData.length;
      $scope.currentSlide = 1;
      page.setTitle('Dr. ' + $scope.doctorInfo.firstName + ' ' + $scope.doctorInfo.lastName +' '+ $scope.doctorInfo.credential + ' | ' + $scope.doctorInfo.specialist);
      Statistic.addViewCount(data._id);
    });
    $scope.updateCurrent = function(dir) {
      if (dir && $scope.currentSlide < $scope.slideCount) {
        $scope.currentSlide = $scope.currentSlide + 1;
      } else if (!dir && $scope.currentSlide > 1) {
        $scope.currentSlide = $scope.currentSlide - 1;
      }
    };
  })
  .controller('MobileContactUsCtrl', function($scope, $http, $mdDialog) {
    $scope.submit = function(form){
      if(form.$valid) {
        $http.post('/contactus',{
          "name":$scope.user.name,
          "email":$scope.user.email,
          "message":$scope.user.message,
          "phone":$scope.user.phone
        }).
            success(function(data) {
              $scope.message = "Your message is sent. Someone will get in touch with you soon.";
              $scope.showAlert($scope.message);
            }).
            error(function(err) {
              $scope.message = "Error sending your message. Please try calling at <a href='tel:+18326304986'>832-630-4986.</a>";
              $scope.showAlert($scope.message);
            });
      }
    }

    $scope.showAlert = function(message) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(false)
          .title('Contact Us')
          .content(message)
          .ariaLabel('Contact Us')
          .ok('OK')
      ).then(function(val){
         window.location.reload();
      });
    };
  })

  .controller('mobileHomeCtrl', function($http, $location){
    var self = this;
    self.selectedItem  = null;
    self.searchText    = null;
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    function querySearch (query) {
      if(query.length < 3){
        return
      }
      return $http.get('/api/doctors/lookup/', {
        params: {
          val: query
        }
      }).then(function(response){
        return response.data.map(function(item){
          return item;
        });
      });
    }
    function selectedItemChange(doctor){
      if(!doctor){
        return;
      }
      $location.path('/'+ doctor.specialist.toLowerCase() + '/' + doctor.doctorId);
    }
  });
