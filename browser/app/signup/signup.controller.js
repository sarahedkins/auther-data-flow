'use strict';

app.controller('SignupCtrl', function ($scope, AuthFactory) {
	$scope.signup = function() {
		AuthFactory.signup($scope.emailInput, $scope.passwordInput)
		.then(function (response) {
			AuthFactory.setCurrentUser(response.data);
		})
		.then(null, function(err) {
			console.log("ERROR - ", err);
		})
	}
});