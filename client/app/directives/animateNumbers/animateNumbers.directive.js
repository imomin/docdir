'use strict';

angular.module('sugarlandDoctorsApp')
  .directive('animateNumbers',function ($timeout) {
        return {
            replace: false,
            scope: {model: '=ngModel'},
            link: function (scope, element, attrs) {
                scope.$watch('model', function (v) {
                    var e = element[0];
                    var refreshInterval = 30; //milliseconds
                    var duration = 1000; //milliseconds
                    var number = v;
                    var step = 0;
                    var num = 0;
                    var steps = Math.ceil(duration / refreshInterval);
                    var increment = (number / steps);
                    var percentCompleted = 0;
                    var lastNumberSlowCount = 3;
                    if(number < 20){
                        e.textContent = number;
                        return true;
                    }
                    if(number > lastNumberSlowCount){
                        number = number - lastNumberSlowCount;
                    }

                    scope.timoutId = null;
                    var counter = function () {
                        scope.timoutId = $timeout(function () {
                            num += increment;
                            percentCompleted = Math.round((num/number) * 100);
                            if(percentCompleted > 60 && percentCompleted < 80){
                                refreshInterval = refreshInterval + 10;
                            }
                            else if (percentCompleted > 90){
                                refreshInterval = 200;
                            }
                            step++;
                            if (step >= steps) {
                                $timeout.cancel(scope.timoutId);
                                num = number;
                                e.textContent = number;
                                if(number > lastNumberSlowCount){
                                    slowCounter();
                                }
                            } else {
                                e.textContent = Math.round(num);
                                counter();
                            }
                        }, refreshInterval);
                    }
                    var slowCounter = function(){
                        scope.timoutId = $timeout(function () {
                            lastNumberSlowCount --;
                            if(lastNumberSlowCount  < 0){
                                $timeout.cancel(scope.timoutId);
                            }
                            else {
                                number++;
                                e.textContent = number;
                                slowCounter();
                            }
                        },500)
                    }
                    counter();
                    return true;    
                });
            }
        }
    });