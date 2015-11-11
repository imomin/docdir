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

    var imagePath = 'img/list/60.jpeg';
    $scope.messages = [
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
    ];
  });