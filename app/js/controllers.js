Parse.initialize("caGilChjK2xB4EpbvVUClKykubFAYglCnTgSMxor", "DuKbXI4WWizZifKQGpTLwoRUJbk3XJ6uhruRof61");

var pikrAppControllers = angular.module('pikrAppControllers', ['angularParse']);

pikrAppControllers.controller('pikrCtrl', ['$scope', '$window', 'picks', '$location', 'parsePersistence', 'parseQuery', '$routeParams', 'Submit', 'Name', 'Details',
function ($scope, $window, picks, $location, parsePersistence, parseQuery, $routeParams, Submit, Name, Details)
{

	$scope.params = $routeParams;
	$scope.picks = picks.getpicks({ id: $scope.params.id });
	$scope.message = ' New, not saved';


	//var promise = Details.pckSubmittedStatus(parseQuery, $scope.params);
	//promise.then(function (res)
	//{
	//	$scope.message = res;
	//});


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

		$location.path('/totals/' + $scope.params.id);

	}


} ]);

pikrAppControllers.controller('detailsCtrl', ['$scope', '$location', 'parseQuery', 'Details', 'pcklst', 'picks', '$routeParams',
  function ($scope, $location, parseQuery, Details, pcklst, picks, $routeParams)
  {

  	$scope.params = $routeParams;
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

			$scope.go = function (path)
			{
				
				$location.path(path);
				
			};

			
  } ]);

  pikrAppControllers.controller('totalCtrl', ['$scope', 'parseQuery', 'Details', 'pcklst', 'picks', '$location', '$routeParams',
  function ($scope, parseQuery, Details, pcklst, picks, $location, $routeParams)
  {
			$scope.params = $routeParams;
			$scope.showPck = function ()
			{
				var id = angular.element("#pckid_txt").val();
				var user = angular.element("#email_txt").val();
				$location.path('/pikr/' + id + '/' + user);
			};

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


  pikrAppControllers.controller('userCtrl', ['$scope', 'parseQuery', '$location', '$routeParams', 'users',
  function ($scope, parseQuery, $location, $routeParams, users)
  {

  	//$scope.status = "Create new user";

  	$scope.submit = function ()
  	{
  		var fname = angular.element("#fnametxt").val();
  		var lname = angular.element("#lnametxt").val();
  		var bday = angular.element("#bdaytxt").val();
  		var gndr = angular.element("#gndrtxt").val();
  		var status = angular.element("#statustxt").val();
  		var prof = angular.element("#proftxt").val();
  		var pw = angular.element("#pwtxt").val();
				var usr = angular.element("#usrtxt").val();
  		var email = angular.element("#emailtxt").val();

				//var  bday= new Date("October 13, 1975 11:13:00")
  		
  		//$scope.status = fname + ', ' + lname + ', ' + user + ', ' + bday + ', ' + gndr + ', ' + status + ', ' + prof + ', ' + pw + ', ' + email;

  		var usrpromise = users.userSignUp(usr, email, pw, fname, lname, gndr, status, prof, bday );
  		usrpromise.then(function (res)
  		{
  			$scope.status = res;
  		});


  	};

			$scope.login = function ()
  	{
  		var fname = angular.element("#fnametxt").val();
  		var lname = angular.element("#lnametxt").val();
  		var bday = angular.element("#bdaytxt").val();
  		var gndr = angular.element("#gndrtxt").val();
  		var status = angular.element("#statustxt").val();
  		var prof = angular.element("#proftxt").val();
  		var pw = angular.element("#pwtxt").val();
				var usr = angular.element("#usrtxt").val();
  		var email = angular.element("#emailtxt").val();

  		var loginpromise = users.userLogin(usr, pw );
  		loginpromise.then(function (res)
  		{
  			$scope.status = res;
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
					
					
				

	