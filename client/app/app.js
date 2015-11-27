'use strict';

angular.module('MyApp', ['ui.router', 'ngLodash'])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
