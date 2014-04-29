Parse.initialize("caGilChjK2xB4EpbvVUClKykubFAYglCnTgSMxor", "DuKbXI4WWizZifKQGpTLwoRUJbk3XJ6uhruRof61");

var pikrAppControllers = angular.module('pikrAppControllers', ['angularParse', 'googlechart']);

pikrAppControllers.controller('pikrCtrl', ['$scope', '$window', 'picks', '$location', 'parsePersistence', 'parseQuery', '$routeParams', 'Submit', 'Name', 'Details', 'users',
function ($scope, $window, picks, $location, parsePersistence, parseQuery, $routeParams, Submit, Name, Details, users){

	angular.element("#logout, #usrmsg").hide();
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

		var promise = Submit.upload(parsePersistence, $scope.params, $scope.picks, angular.element("#cmnt_txt").val());
		promise.then(function (res)
		{
			$scope.msg = res;
			$location.path('/totals/' + $scope.params.id + '/' + $scope.params.user + '/' + res);
			//$location.path('/pikr/' + $scope.params.user);
		});

	}


} ]);

pikrAppControllers.controller('detailsCtrl', ['$scope', '$location', 'parseQuery', 'Details', 'pcklst', 'picks', '$routeParams',
  function ($scope, $location, parseQuery, Details, pcklst, picks, $routeParams)
  {

  	$scope.params = $routeParams;
  	$scope.pcks = pcklst.getPcklst();
  	$scope.filters = ["pick", "users"];
  	$scope.dfilters = ['gender','status'];
  	$scope.dOptions = [{ 'id': 1, 'type': 'gender', 'value': 'male' },
																						{ 'id': 2, 'type': 'gender', 'value': 'female' },
																						{ 'id': 3, 'type': 'status', 'value': 'single' },
																						{ 'id': 1, 'type': 'status', 'value': 'married'}];
  	$scope.picks = picks.getpicks({ id: $scope.params.id });
  	var getDetailsPromise = Details.getDetails(parseQuery, "pckid");
  	getDetailsPromise.then(function (res)
  	{
  		$scope.details = res;
  		$scope.orderProp = 'user';
  		angular.element("#usrmsg, #status, #users").hide();
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
  	$scope.pcklst = pcklst.getPcklst({}, function ()
  	{

  		var getTotalsPromise = Details.getTotals(parseQuery, $scope.pcklst, "pckid");
  		getTotalsPromise.then(function (res)
  		{
  			$scope.totals = res;
  		});

  		var getChartDetailsPromise = Details.getChartResults(parseQuery, $scope.pcklst, "pckid", $scope.params);
  		getChartDetailsPromise.then(function (res)
  		{
  			//$scope.usrchart = res;
  		});


  		var getChartTotalsPromise = Details.getChartTotals(parseQuery, $scope.pcklst, "pckid", $scope.params);
  		getChartTotalsPromise.then(function (res)
  		{
  			var chart1 = {};
  			chart1.type = "PieChart";
  			chart1.cssStyle = "height:450px; width:400px;";
  			chart1.data = res;

  			chart1.options = {
  				'title': 'Total results',
  				"isStacked": "false",
  				"fill": 10,
  				"displayExactValues": true
  			};

  			chart1.formatters = {};

  			$scope.chart1 = chart1;
  		});

  		var MChartPromise = Details.pckChartStats(parseQuery, $scope.pcklst, "gender", 'Male', $scope.params);
  		MChartPromise.then(function (res)
  		{

  			var chart2 = {};
  			chart2.type = "PieChart";
  			chart2.data = res;

  			chart2.options = {
  				'title': 'Results by Gender: Male',
  				"isStacked": "false",
  				"fill": 10,
  				"displayExactValues": true
  			};

  			chart2.formatters = {};

  			$scope.chart2 = chart2;

  		});

  		var FChartPromise = Details.pckChartStats(parseQuery, $scope.pcklst, "gender", 'Female', $scope.params);
  		FChartPromise.then(function (res)
  		{

  			var chart3 = {};
  			chart3.type = "PieChart";
  			chart3.data = res;

  			chart3.options = {
  				'title': 'Results by Gender: Female',
  				"isStacked": "false",
  				"fill": 10,
  				"displayExactValues": true
  			};

  			chart3.formatters = {};

  			$scope.chart3 = chart3;

  		});

  		var SngChartPromise = Details.pckChartStats(parseQuery, $scope.pcklst, "status", 'Single', $scope.params);
  		SngChartPromise.then(function (res)
  		{

  			var chart4 = {};
  			chart4.type = "PieChart";
  			chart4.data = res;

  			chart4.options = {
  				'title': 'Results by Status: Single',
  				"isStacked": "false",
  				"fill": 10,
  				"displayExactValues": true
  			};

  			chart4.formatters = {};

  			$scope.chart4 = chart4;

  		});

  		var MrdChartPromise = Details.pckChartStats(parseQuery, $scope.pcklst, "status", 'Married', $scope.params);
  		MrdChartPromise.then(function (res)
  		{

  			var chart5 = {};
  			chart5.type = "PieChart";
  			chart5.data = res;

  			chart5.options = {
  				'title': 'Results by Staus: Married',
  				"isStacked": "false",
  				"fill": 10,
  				"displayExactValues": true
  			};

  			chart5.formatters = {};

  			$scope.chart5 = chart5;

  		});


  		var countPckrsPromise = Details.countPckrs(parseQuery, $scope.pcklst, "pckid");
  		countPckrsPromise.then(function (res)
  		{
  			$scope.pckrs = res;
  		});

  		var pckGChartPromise = Details.pckStats(parseQuery, $scope.pcklst);
  		pckGChartPromise.then(function (res)
  		{
  			$scope.usrMVals = res;
  		});

  		var pckUsrMValsPromise = Details.pckStats(parseQuery, $scope.pcklst, "gender", 'Male');
  		pckUsrMValsPromise.then(function (res)
  		{
  			$scope.usrMVals = res;
  		});


  		var pckUsrMCntPromise = Details.pckStatsTotals(parseQuery, $scope.pcklst, "gender", 'Male');
  		pckUsrMCntPromise.then(function (res)
  		{
  			$scope.usrMCnts = res;
  		});

  		var pckUsrFValsPromise = Details.pckStats(parseQuery, $scope.pcklst, "gender", 'Female');
  		pckUsrFValsPromise.then(function (res)
  		{
  			$scope.usrFVals = res;
  		});

  		var pckUsrFCntPromise = Details.pckStatsTotals(parseQuery, $scope.pcklst, "gender", 'Female');
  		pckUsrFCntPromise.then(function (res)
  		{
  			$scope.usrFCnts = res;
  		});

  		var pckUsrSngValsPromise = Details.pckStats(parseQuery, $scope.pcklst, "status", 'Single');
  		pckUsrSngValsPromise.then(function (res)
  		{
  			$scope.usrSngVals = res;
  		});

  		var pckUsrSngCntPromise = Details.pckStatsTotals(parseQuery, $scope.pcklst, "status", 'Single');
  		pckUsrSngCntPromise.then(function (res)
  		{
  			$scope.usrSngCnts = res;
  		});

  		var pckUsrMrdValsPromise = Details.pckStats(parseQuery, $scope.pcklst, "status", 'Married');
  		pckUsrMrdValsPromise.then(function (res)
  		{
  			$scope.usrMrdVals = res;
  		});

  		var pckUsrMrdCntPromise = Details.pckStatsTotals(parseQuery, $scope.pcklst, "status", 'Married');
  		pckUsrMrdCntPromise.then(function (res)
  		{
  			$scope.usrMrdCnts = res;
  		});

  		$scope.resultsBy = function ()
  		{

  			angular.element("#pick, #status").hide();
  			var val = '#' + angular.element("#resultsBy").val();
  			angular.element(val).show();
  		};

  		$scope.dresultsBy = function ()
  		{

  			angular.element("#gender, #status").hide();
  			var val = '#' + angular.element("#dresultsBy").val();
  			angular.element(val).show();
  		};

  	});


  } ]);

pikrAppControllers.controller('userCtrl', ['$scope', 'parseQuery', '$location', '$routeParams', 'users', 'picks',
  function ($scope, parseQuery, $location, $routeParams, users, picks){
  	
			angular.element("#loginbox, #join, #intro").show();
			angular.element("#mypicks, #logoutbox, #details, #totals, #usrmsg").hide();
			$scope.picks = picks.getpicks({ id:'pck0001' });
			
			var stspromise = users.getUsrStatus();
  	stspromise.then(function (res)
  	{
  		$scope.status = res;

				if(res != "nobody")
				{
					angular.element("#usrstatus").html(res);
					angular.element("#loginbox, #join, #intro").hide();
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
  		var pw = angular.element("#usrpwtxt").val();
				var pw2 = angular.element("#usrpwtxt2").val();
  		var usr = angular.element("#usrnametxt").val();
  		var email = angular.element("#emailtxt").val();

  		var bday = new Date(angular.element("#bdaytxt").val())

  		var usrpromise = users.userSignUp(usr, email, pw, pw2, fname, lname, gndr, status, prof, bday);
				usrpromise.then(function (res)
  		{
  			$scope.status = res;
  			$location.path('/pikr/' + res);
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
  			angular.element("#usrstatus").html(res);
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
					angular.element("#usrstatus").html(res);
  			angular.element("#loginbox, #join").show();
					angular.element("#mypicks").hide();
					angular.element("#usrtxt, #pwtxt").val('');
					
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

			var usrdetailspromise = users.getUsrDetails();
			usrdetailspromise.then(function (res)
  	{
  		$scope.usr = res;
  	});







  } ]);
					
					
				

	