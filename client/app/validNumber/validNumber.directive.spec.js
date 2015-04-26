'use strict';

describe('Directive: validNumber', function () {

  // load the directive's module
  beforeEach(module('sugarlandDoctorsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<valid-number></valid-number>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the validNumber directive');
  }));
});