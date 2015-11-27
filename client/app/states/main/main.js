'use strict';

angular.module('MyApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/states/main/main.html',
        controller: 'MainCtrl'
      });
  });
