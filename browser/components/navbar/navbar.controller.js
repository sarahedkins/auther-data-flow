'use strict';

app.controller('NavbarCtrl', function ($scope, AuthFactory) {
    $scope.currentUser =  AuthFactory.getCurrentUser;
});