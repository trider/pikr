'use strict';

// Declare app level module which depends on filters, and services
var pikrApp = angular.module('pikrApp', [ 'ngRoute', 'pikrAppControllers', 'pikrAppDirectives']);

pikrApp.config(['$routeProvider',
  function ($routeProvider)
  {
  	$routeProvider.
        when('/pikr', {
        	templateUrl: 'partials/pikr.html',
        	controller: 'pikrCtrl'
        }).
								otherwise({
										redirectTo: '/pikr'
								});


  } ]);
