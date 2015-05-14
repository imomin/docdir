'use strict';

describe('Directive: animateNumbers', function () {

  // load the directive's module
  beforeEach(module('sugarlandDoctorsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<animate-numbers></animate-numbers>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the animateNumbers directive');
  }));
});