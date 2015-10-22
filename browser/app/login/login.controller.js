'use strict';

app.controller('LoginCtrl', function ($scope, AuthFactory, $rootScope) {
    $scope.login = function() {
		AuthFactory.login($scope.emailInput, $scope.passwordInput)
		.then(function (response) {
			AuthFactory.setCurrentUser(response.data);
			$rootScope.$broadcast('login', response.data);
			//$scope.$digest();
		})
		.then(null, function(err) {
			console.log("ERROR - ", err);
		})
	}
});