'use strict';

// Declare app level module which depends on filters, and services
var pikrApp = angular.module('pikrApp', [ 'ngRoute', 'pikrAppControllers', 'pikrAppDirectives', 'pikrAppServices']);

pikrApp.config(['$routeProvider',
  function ($routeProvider)
  {
  	$routeProvider.
        when('/pikr', {
        	templateUrl: 'partials/welcome.html',
        	controller: 'pikrCtrl'
        })
								.when('/pikr/:id', {
										templateUrl: 'partials/pikr.html',
										controller: "pikrCtrl"
								})
								.when('/pikr/:id/:user', {
										templateUrl: 'partials/pikr.html',
										controller: "pikrCtrl"
								})
								.when('/details', {
										templateUrl: 'partials/details.html',
										controller: "detailsCtrl"
								}).
								otherwise({
										redirectTo: '/pikr'
								});

  } ]);
