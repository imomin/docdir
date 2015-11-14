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
            icon: 'fa fa-group'
          },{
            name: 'Login',
            type: 'link',
            state: 'main.login',
            icon: 'fa fa-group'
          }, {
            name: 'Contact Us',
            state: 'main.contactus',
            type: 'link',
            icon: 'fa fa-map-marker'
          }]
        });
        
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
          link: function(scope, element, attrs) {
            
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
  .controller('MobileDetailCtrl',function($scope, $state, $mdSidenav, menu, Doctor){
    // Doctor.details({id:$state.current.data.specialist,controller:$state.params.doctorId},function(data){
    //   debugger;
    // });
    //$scope.doctorInfo = {"stats":{"website":14,"phone":7,"likes":3,"views":322,"_id":"557ca2fd864fae18941ffe94"},"_id":"557ca2fd864fae18941ffe94","doctorId":"dr-zhill-maknojia","firstName":"Zhill","lastName":"Maknojia","email":"imomin@gmail.com","phone":"8326304986","personalInterest":[],"affiliation":[],"professionalMembership":[],"boardCertification":[],"__v":0,"bio":"I'm a doctor..","credential":"MD","dateOfBirth":"1963-02-06T06:00:00.000Z","gender":"Male","specialist":"Dentist","subscriptionType":"yearly","website":"www.myhealthservicewebsite.com","profilePicture":"/assets/images/553f24fed4186cb8656520e5/f7aedf6b-7468-462a-a19e-00d0b580f91b-iastute.jpg","isEmailConfirmed":false,"pictures":[],"addresses":[{"_id":"5574d2580db4a81752526d79","workDays":[{"name":"Sunday","isOpen":false,"open":"9:45 PM","close":"9:45 PM","_id":"55497dabd86e5cbf8a1b9cb7"},{"name":"Monday","isOpen":true,"open":"8:00 AM","close":"5:00 PM","_id":"55497dabd86e5cbf8a1b9cb6"},{"name":"Tuesday","isOpen":true,"open":"9:00 AM","close":"6:00 PM","_id":"55497dabd86e5cbf8a1b9cb5"},{"name":"Wednesday","isOpen":true,"open":"9:00 AM","close":"6:00 PM","_id":"55497dabd86e5cbf8a1b9cb4"},{"name":"Thursday","isOpen":true,"open":"9:00 AM","close":"6:00 PM","_id":"55497dabd86e5cbf8a1b9cb3"},{"name":"Friday","isOpen":true,"open":"9:00 AM","close":"6:00 PM","_id":"55497dabd86e5cbf8a1b9cb2"},{"name":"Saturday","isOpen":false,"open":"9:45 PM","close":"9:45 PM","_id":"55497dabd86e5cbf8a1b9cb1"}],"address":{"streetAddress":"15015 Westheimer Parkway","city":"Houston","state":"Texas","postalCode":"77082","latitude":29.732986204983195,"longitude":-95.65270230265503,"suite":"A","phone":"123-123-1231"}}],"personalInterests":["Flying","Golf"],"affiliations":["Herman Hospital","Methodist Sugar Land","St. Luke"],"professionalMemberships":["American Academy of Family Physicians"],"boardCertifications":["Family Medicine"],"educations":[{"degree":"MD","college":"College of Doctors","yearGraduate":2004,"_id":"554325198d4dbb5874b99eeb"},{"degree":"Residency","college":"Medical Office","yearGraduate":2005,"_id":"554325198d4dbb5874b99eea"}],"languages":["English","Hindi","Urdu","Azerbaijani","Persian"],"insurances":["Blue Cross Blue Shield","Blue Cross","Regence BlueCross BlueShield","Anthem Blue Cross","Highmark Blue Cross Blue Shield","ODS Health Network"]}
    $scope.doctorInfo =  {"stats":{"website":2,"phone":3,"likes":5,"views":83,"_id":"553f24fed4186cb8656520e5"},"_id":"553f24fed4186cb8656520e5","doctorId":"imtiyaz-momin-mdds","firstName":"Imtiyaz","lastName":"Momin","email":"imomin@gmail.com","phone":"8326304986","personalInterest":[],"affiliation":[],"professionalMembership":[],"boardCertification":[],"__v":0,"bio":"This is a good doctor.","credential":"MDDS","dateOfBirth":"1963-02-06T06:00:00.000Z","gender":"Male","specialist":"Dentist","subscriptionType":"yearly","website":"www.myhealthservicewebsite.com","profilePicture":"/assets/images/553f24fed4186cb8656520e5/f7aedf6b-7468-462a-a19e-00d0b580f91b-iastute.jpg","isEmailConfirmed":false,"pictures":["/assets/images/553f24fed4186cb8656520e5/1664aa4b-a7f0-4267-9af8-7f91f670cc1a-Aliyana.png","/assets/images/553f24fed4186cb8656520e5/5635b4ea-4e54-4ff7-899a-ac116563a075-PrimeTime Logo.jpg","/assets/images/553f24fed4186cb8656520e5/0e5b3be7-907d-4aa8-8757-d7ed682582c3-Message_and_ACT_and_ACT.png"],"addresses":[{"_id":"561e78f04c7fdb38be4ee4d1","workDays":[{"name":"Sunday","isOpen":false,"open":null,"close":null,"_id":"55497dabd86e5cbf8a1b9cb7"},{"name":"Monday","isOpen":true,"open":"8:00 AM","close":"2:00 PM","_id":"55497dabd86e5cbf8a1b9cb6"},{"name":"Tuesday","isOpen":true,"open":"9:00 AM","close":"6:00 PM","_id":"55497dabd86e5cbf8a1b9cb5"},{"name":"Wednesday","isOpen":true,"open":"9:00 AM","close":"6:00 PM","_id":"55497dabd86e5cbf8a1b9cb4"},{"name":"Thursday","isOpen":true,"open":"9:00 AM","close":"6:00 PM","_id":"55497dabd86e5cbf8a1b9cb3"},{"name":"Friday","isOpen":true,"open":"9:00 AM","close":"6:00 PM","_id":"55497dabd86e5cbf8a1b9cb2"},{"name":"Saturday","isOpen":false,"open":"12:15 AM","close":"12:15 AM","_id":"55497dabd86e5cbf8a1b9cb1"}],"address":{"streetAddress":"12404 South Kirkwood Road","city":"Stafford","state":"Texas","postalCode":"77477","latitude":29.642871195321494,"longitude":-95.58236962698356,"suite":"A","phone":"123-123-1231"}}],"personalInterests":["Flying","Golf"],"affiliations":["Herman Hospital","Methodist Sugar Land","St. Luke"],"professionalMemberships":["American Academy of Family Physicians","Member of Board of Dentist"],"boardCertifications":["Family Medicine","Some certification"],"educations":[{"degree":"MD","college":"College of Doctors","yearGraduate":2004,"_id":"554325198d4dbb5874b99eeb"},{"degree":"Residency","college":"Medical Office","yearGraduate":2005,"_id":"554325198d4dbb5874b99eea"},{"degree":"MBBS","college":"Some College","yearGraduate":2007,"_id":"561e78f04c7fdb38be4ee4d2"}],"languages":["English","Hindi","Urdu","Azerbaijani","Persian"],"insurances":["Blue Cross Blue Shield","Blue Cross","Regence BlueCross BlueShield","Anthem Blue Cross","Highmark Blue Cross Blue Shield","ODS Health Network","DenteMax","Medicare"]}
    $scope.slideData = $scope.doctorInfo.pictures;
      // for (var i = 0; i < $scope.doctorInfo.pictures.length; i++) {
      //   $scope.slideData.push({
      //     'image': $scope.doctorInfo.pictures[i],
      //     'text': ''
      //   });
      // };
    /* The number of slides */
    $scope.slideCount = $scope.slideData.length;

    /* Set the current slide position, initial is 1 for first slide */
    $scope.currentSlide = 1;
    $scope.updateCurrent = function(dir) {
      if (dir && $scope.currentSlide < $scope.slideCount) {
        $scope.currentSlide = $scope.currentSlide + 1;
      } else if (!dir && $scope.currentSlide > 1) {
        $scope.currentSlide = $scope.currentSlide - 1;
      }
    };
  });