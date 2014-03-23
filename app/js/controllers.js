Parse.initialize("caGilChjK2xB4EpbvVUClKykubFAYglCnTgSMxor", "DuKbXI4WWizZifKQGpTLwoRUJbk3XJ6uhruRof61");

var pikrAppControllers = angular.module('pikrAppControllers', ['angularParse']);

pikrAppControllers.controller('pikrCtrl', ['$scope', 'picks', '$location', 'parsePersistence', 'parseQuery', '$routeParams', 'Submit', 'Name', 'Details', function ($scope, picks, $location, parsePersistence, parseQuery, $routeParams, Submit, Name, Details)
{


	$scope.params = $routeParams;
	$scope.picks = picks.getpicks({ id: $scope.params.id });

	var promise = Details.pckSubmittedStatus(parseQuery, $scope.params);
	promise.then(function (res)
	{
		$scope.message = res;
	}, function (reason)
	{
		alert('Failed: ' + reason);
	});


	$scope.handleDrop = function (item, bin)
	{
		$scope.message = item + ' has been dropped into ' + bin;
	}

	$scope.go = function (path)
	{
		$location.path(path);
	};

	$scope.submit = function ()
	{

		$scope.message = Name.getName($scope.picks);
		angular.element("#droptxt").html($scope.name);
		$scope.msg = Submit.upload(parsePersistence, $scope.params.user, $scope.params.id, $scope.picks, angular.element("#cmnt_txt").val());
		angular.element("#droptxt").append($scope.msg);

	}

} ]);

pikrAppControllers.controller('detailsCtrl', ['$scope', '$location', 'parseQuery', 'Details', 'pcklst', 'picks', 
  function ($scope, $location, parseQuery, Details, pcklst, picks)
  {

  	$scope.pcks = pcklst.getPcklst();
									
			var promise = Details.getDetails(parseQuery, "pckid");
  	promise.then(function (res)
  	{
  		$scope.details = res;
  	});

			var promise2 = Details.getResults(parseQuery, "val");
  	promise2.then(function (data)
  	{
  		$scope.results = data;
  	});

  } ]);

  pikrAppControllers.controller('totalCtrl', ['$scope', 'parseQuery', 'Details', 'pcklst', 'picks',
  function ($scope, parseQuery, Details, pcklst, picks )
  {

			$scope.pcklst = pcklst.getPcklst({}, function()
			{
							
							var promise = Details.getTotals(parseQuery, $scope.pcklst, "pckid");
							promise.then(function (res)
  					{
  						$scope.totals = res;
  					});		

							var promise2 = Details.countPckrs(parseQuery, $scope.pcklst, "pckid");
							promise2.then(function (res)
  					{
  						$scope.pckrs = res;
  					});		
			});

  } ]);
					
					
				

	