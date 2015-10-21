'use strict';

app.controller('LoginCtrl', function ($scope, AuthFactory) {
    $scope.login = function() {
		AuthFactory.login($scope.emailInput, $scope.passwordInput)
		.then(function (data) {
			console.log(data);
		})
		.then(null, function(err) {
			console.log("ERROR - ", err);
		})
	}
});