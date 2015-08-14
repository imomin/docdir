'use strict';

angular.module('sugarlandDoctorsApp')
	.controller('ContactUsCtrl', function ($scope, $http, $q, page) {
		page.setTitle("Sugar Land Doctors Contact Us");
		$scope.submit = function(form){
			$scope.submitted = true;
			$scope.hasError = false;
			if(form.$valid) {
				$http.post('/contactus',{
					"name":$scope.mailContent.name,
					"email":$scope.mailContent.email,
					"message":$scope.mailContent.message,
					"phone":$scope.mailContent.phone
				}).
		        success(function(data) {
					form.autoValidateFormOptions.resetForm();
					$scope.message = "Your message is sent. Someone will get in touch with you soon.";
		        }).
		        error(function(err) {
		        	$scope.hasError = true;
		        	form.autoValidateFormOptions.resetForm();
					$scope.message = "Error sending your message. Please try calling at 832-630-4986.";
		        });
			}
		}
	});