'use strict';

app.factory('AuthFactory', function ($http) {
	return {
		signup: function(username, password) {
			//create new user
			return $http.post('/api/users/signup', {email: username, password: password})
			.then(function (response) {
				return response;
			})
		},

		login: function(username, password) {
			return $http.post('/api/users/login', {email: username, password: password})
			.then(function (response) {
				return response;
			})
		}
	}
});