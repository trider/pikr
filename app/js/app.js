'use strict';

// Declare app level module which depends on filters, and services
var pikrApp = angular.module('pikrApp', [ 'ngRoute', 'pikrAppControllers', 'pikrAppDirectives', 'pikrAppServices']);

pikrApp.config(['$routeProvider',
  function ($routeProvider)
  {
  	$routeProvider
							.
        when('/pikr', {
        	templateUrl: 'partials/welcome.html',
        	controller: 'totalCtrl'
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
								})
								.when('/details/:id', {
										templateUrl: 'partials/details.html',
										controller: "detailsCtrl"
								})
								.when('/results', {
										templateUrl: 'partials/results.html',
										controller: "detailsCtrl"
								})
								.when('/totals', {
										templateUrl: 'partials/totals.html',
										controller: "totalCtrl"
								}).when('/totals/:id', {
										templateUrl: 'partials/totals.html',
										controller: "totalCtrl"
								})
								.otherwise({
										redirectTo: '/pikr'
								});

  } ]);
