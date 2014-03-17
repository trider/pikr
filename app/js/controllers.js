Parse.initialize("caGilChjK2xB4EpbvVUClKykubFAYglCnTgSMxor", "DuKbXI4WWizZifKQGpTLwoRUJbk3XJ6uhruRof61");

var pikrAppControllers = angular.module('pikrAppControllers', ['angularParse']);

pikrAppControllers.controller('pikrCtrl', ['$scope', 'picks', '$location', 'parsePersistence', 'parseQuery', '$routeParams', 'Submit', 'Name', 'Details', function ($scope, picks, $location, parsePersistence, parseQuery, $routeParams, Submit, Name, Details)
{


	$scope.params = $routeParams;
	console.log($scope.params);

	$scope.picks = picks.getpicks({ id: $scope.params.id });

	var promise = Details.pckSubmittedStatus(parseQuery, $scope.params);
			promise.then(function(res) {
					alert(res);
			}, function(reason) {
					alert('Failed: ' + reason);
			});


	$scope.handleDrop = function (item, bin)
	{
		angular.element("#droptxt").html(item + ' has been dropped into ' + bin);
	}

	$scope.go = function (path)
	{
		$location.path(path);
	};

	$scope.submit = function ()
	{

		$scope.name = Name.getName($scope.picks);
		angular.element("#droptxt").html($scope.name);
		$scope.msg = Submit.upload(parsePersistence, $scope.params.user, $scope.params.id, $scope.picks, angular.element("#cmnt_txt").val());
		angular.element("#droptxt").append($scope.msg);

	}

} ]);


pikrAppControllers.controller('detailsCtrl', ['$scope', '$location', 'parseQuery', 'Details',
  function ($scope, $location, parseQuery, Details)
  {

  	var promise = Details.getDetails(parseQuery, "pckid", "pck0001");
  	promise.then(function (res)
  	{
  		$scope.details = res;
  	});



  } ]);
					
					
				

	