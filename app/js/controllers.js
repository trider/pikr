Parse.initialize("caGilChjK2xB4EpbvVUClKykubFAYglCnTgSMxor", "DuKbXI4WWizZifKQGpTLwoRUJbk3XJ6uhruRof61");

var pikrAppControllers = angular.module('pikrAppControllers', ['angularParse']);

pikrAppControllers.controller('pikrCtrl', ['$scope', '$window', 'picks', '$location', 'parsePersistence', 'parseQuery', '$routeParams', 'Submit', 'Name', 'Details', 'users',
function ($scope, $window, picks, $location, parsePersistence, parseQuery, $routeParams, Submit, Name, Details, users)
{

	angular.element("#logout").hide();
	$scope.params = $routeParams;
	$scope.picks = picks.getpicks({ id: $scope.params.id });

	var getUsrStatusPromise = users.getUsrStatus();
	getUsrStatusPromise.then(function (res)
	{
			$scope.status = res;
	});

	var getUsrIDPromise = users.getUsrID();
	getUsrIDPromise.then(function (res)
	{
		$scope.status = res;

	});


	var submittedPromise = Details.pckSubmittedStatus(parseQuery, $scope.params);
	submittedPromise.then(function (res)
	{
			//$scope.pckpath = res;
			$location.path(res);
	});


	$scope.handleDrop = function (item, bin)
	{
		$scope.message = item + ' has been dropped into ' + bin;
	}

	$scope.go = function (path)
	{
		$location.path(path);
	};

	$scope.submitPick = function ()
	{

		$scope.message = Name.getName($scope.picks);
		angular.element("#droptxt").html($scope.name);

		var promise = Submit.upload(parsePersistence, $scope.params.user, $scope.params.id, $scope.picks, angular.element("#cmnt_txt").val());
		promise.then(function (res)
		{
			$scope.msg = res;
			$location.path('/totals/' + $scope.params.id + '/' + $scope.params.user + '/' + res);
		});

	}


} ]);

pikrAppControllers.controller('detailsCtrl', ['$scope', '$location', 'parseQuery', 'Details', 'pcklst', 'picks', '$routeParams',
  function ($scope, $location, parseQuery, Details, pcklst, picks, $routeParams)
  {

  	$scope.params = $routeParams;
  	$scope.pcks = pcklst.getPcklst();

  	var getDetailsPromise = Details.getDetails(parseQuery, "pckid");
  	getDetailsPromise.then(function (res)
  	{
  		$scope.details = res;
  	});

  	var getResultsPromise = Details.getResults(parseQuery, "val");
  	getResultsPromise.then(function (data)
  	{
  		$scope.results = data;
  	});

			$scope.go = function (path)
			{
				
				$location.path(path);
				
			};

			$scope.showPck = function ()
			{
				var id = angular.element("#pckid_txt").val();
				var user = angular.element("#usr_txt").val();
				$location.path('/pikr/' + id + '/' + user);
			};

			$scope.pcklst = pcklst.getPcklst({}, function()
			{
							
							var getTotalsPromise = Details.getTotals(parseQuery, $scope.pcklst, "pckid");
							getTotalsPromise.then(function (res)
  					{
  						$scope.totals = res;
  					});		

							var countPckrsPromise = Details.countPckrs(parseQuery, $scope.pcklst, "pckid");
							countPckrsPromise.then(function (res)
  					{
  						$scope.pckrs = res;
  					});		
							
			});

			
  } ]);

  pikrAppControllers.controller('userCtrl', ['$scope', 'parseQuery', '$location', '$routeParams', 'users',
  function ($scope, parseQuery, $location, $routeParams, users)
  {
  	
			angular.element("#loginbox, #join").show();
			angular.element("#mypicks, #logoutbox, #details, #totals").hide();
			
			var stspromise = users.getUsrStatus();
  	stspromise.then(function (res)
  	{
  		$scope.status = res;

				if(res != "nobody")
				{
					angular.element("#status").html(res);
					angular.element("#loginbox, #join").hide();
					angular.element("#mypicks, #logoutbox, #details, #totals").show();
				}

  	});

  	$scope.userSignup = function ()
  	{
  		var fname = angular.element("#fnametxt").val();
  		var lname = angular.element("#lnametxt").val();
  		var gndr = angular.element("#gndrtxt").val();
  		var status = angular.element("#statustxt").val();
  		var prof = angular.element("#proftxt").val();
  		var pw = angular.element("#pwtxt").val();
  		var usr = angular.element("#usrtxt").val();
  		var email = angular.element("#emailtxt").val();

  		var bday = new Date(angular.element("#bdaytxt").val())

  		var usrpromise = users.userSignUp(usr, email, pw, fname, lname, gndr, status, prof, bday);
  		usrpromise.then(function (res)
  		{
  			$scope.status = res;
  			$location.path('/pickr' + usr);
  		});
  	};

  	$scope.login = function ()
  	{

  		var pw = angular.element("#pwtxt").val();
  		var usr = angular.element("#usrtxt").val();
  		var loginpromise = users.userLogin(usr, pw);
  		loginpromise.then(function (res)
  		{
  			$location.path('/pikr/' + usr);
					$scope.status = res;
  			angular.element("#status").html(res);
  			angular.element("#mypicks").show();
  			angular.element("#loginbox, #join").hide();
  		});

  	};

  	$scope.logout = function ()
  	{
  		var logoutpromise = users.userLogout();
  		logoutpromise.then(function (res)
  		{
  			
					$location.path('/pikr');
  			$scope.status = res;
					angular.element("#status").html(res);
  			angular.element("#loginbox, #join").show();
					angular.element("#mypicks").hide();

  		});

  		

  	};

  	$scope.clear = function ()
  	{
  		angular.element("#fnametxt").val("");
  		angular.element("#lnametxt").val("");
  		angular.element("#usrtxt").val("");
  		angular.element("#bdaytxt").val("");
  		angular.element("#gndrtxt").val("");
  		angular.element("#statustxt").val("");
  		angular.element("#proftxt").val("");
  		angular.element("#pwtxt").val("");
  		angular.element("#emailtxt").val("");
  	};






  } ]);
					
					
				

	