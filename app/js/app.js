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
        	controller: 'userCtrl'
        })
								.when('/pikr/:user', {
										templateUrl: 'partials/welcome.html',
										controller: "userCtrl"
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
								}).when('/results', {
										templateUrl: 'partials/results.html',
										controller: "detailsCtrl"
								})
								.when('/totals', {
										templateUrl: 'partials/totals.html',
										controller: "detailsCtrl"
								})
								.when('/totals/:id', {
										templateUrl: 'partials/totals.html',
										controller: "detailsCtrl"
								})
								.when('/totals/:id/:user/:parentID', {
										templateUrl: 'partials/total.html',
										controller: "detailsCtrl"
								})
								.when('/user', {
										templateUrl: 'partials/user.html',
										controller: "userCtrl"
								})
								.when('/login', {
										templateUrl: 'partials/login.html',
										controller: "userCtrl"
								})
								.when('/logout', {
										templateUrl: 'partials/logout.html',
										controller: "userCtrl"
								})
								.when('/usrmsg', {
										templateUrl: 'partials/usrmsg.html',
										controller: "userCtrl"
								}).when('/upload', {
										templateUrl: 'partials/upload.html',
										controller: "userCtrl"
								})
								.otherwise({
										redirectTo: '/pikr'
								});

  } ]);

//		pikrApp.config(function (ezfbProvider) {
//				ezfbProvider
//				.setInitParams({
//						appId: '420875628049980'
//				});  
//});
