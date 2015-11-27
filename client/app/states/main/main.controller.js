'use strict';

angular.module('MyApp')
  .controller('MainCtrl', function($scope, $state, $stateParams, $http) {

    // Get data from the endpoint
    $http.get('/api/MyDemoEndpoint')
      .success(function(response) {

        $scope.response = response;

      });

  });
