//var parsefbint = 420875628049980; //prod app id
var parsefbint = 447892032015006; //test app id

Parse.initialize( "caGilChjK2xB4EpbvVUClKykubFAYglCnTgSMxor", "DuKbXI4WWizZifKQGpTLwoRUJbk3XJ6uhruRof61" );

var pikrAppControllers = angular.module( 'pikrAppControllers', ['angularParse', 'googlechart', 'angularFileUpload'] );

pikrAppControllers.controller('pikrCtrl', ['$scope', '$window', '$location', 'parsePersistence', 'parseQuery', '$routeParams', 'Submit', 'Details', 'users', 'Files', 'Name',
function ($scope, $window, $location, parsePersistence, parseQuery, $routeParams, Submit, Details, users, Files, Name ){

	angular.element("#logout, #usrmsg").hide();
	$scope.params = $routeParams;
	
	var PckDetailsPromise = Files.getPck( parseQuery, $scope.params );
 PckDetailsPromise.then( function ( res ) {
    $scope.pckdetails = res;
    $scope.picks = res.imgs;
	});
	
	
	var getUsrStatusPromise = users.getUsrStatus();
	getUsrStatusPromise.then(function (res){
		$scope.status = res;
	});
	
	var getUsrIDPromise = users.getUsrID();
	getUsrIDPromise.then(function (res){
		$scope.status = res;
	});
	
	var submittedPromise = Details.pckSubmittedStatus(parseQuery, $scope.params);
	submittedPromise.then(function (res){
		$location.path(res);
	});
	
	$scope.handleDrop = function (item, bin){
		$scope.message = item + ' has been dropped into ' + bin;
	}
	$scope.go = function (path){
		$location.path(path);
	};
	$scope.submitPick = function (){

		$scope.message = Name.getName($scope.picks);
		angular.element("#droptxt").html($scope.name);

		var promise = Submit.upload(parsePersistence, $scope.params, $scope.picks, angular.element("#cmnt_txt").val());
		promise.then(function (res){
			$scope.msg = res;
			$location.path('/totals/' + $scope.params.id + '/' + $scope.params.user + '/' + res);
			//$location.path('/pikr/' + $scope.params.user);
		});

	}
} ]);

pikrAppControllers.controller('detailsCtrl', ['$scope', '$location', 'parseQuery', 'Details', '$routeParams', '$rootScope', 'Files',
 function ($scope, $location, parseQuery, Details, $routeParams, $rootScope, Files)
 {

 	$scope.params = $routeParams;
 	$scope.filters = ["pick", "users"];
 	$scope.dfilters = [{ 'type': 'gender' }, { 'type': 'status'}];
 	$scope.dOptions = [{ 'id': 0, 'type': '-- Type --', 'value': '-- Options --' },
																						{ 'id': 1, 'type': 'gender', 'value': 'Male' },
																						{ 'id': 2, 'type': 'gender', 'value': 'Female' },
																						{ 'id': 3, 'type': 'status', 'value': 'Single' },
																						{ 'id': 1, 'type': 'status', 'value': 'Married'}];

		$scope.go = function (path)	{
 		$location.path(path);
 	};

 	$scope.activate = function (elm){
 		angular.element(elm).prop('disabled', false);
 	};


 	$scope.showPck = function (){
 		var id = angular.element("#pckid_txt").val();
 		var user = angular.element("#usr_txt").val();
 		//$location.path('/pikr/' + id + '/' + user);
 	};

 	var PcksPromise = Details.getPcks(parseQuery);
 	PcksPromise.then(function (res){
 		$scope.picks = res;
 		$rootScope.picks = res;
 	} );
 
 	var getDetailsPromise = Details.getDetails(parseQuery, "pckid");
 	getDetailsPromise.then(function (res){
 		$scope.details = res;
 		$scope.orderProp = 'user';
 		angular.element("#usrmsg, #status, #users").hide();
 	});

 	var getResultsPromise = Details.getResults(parseQuery, "val");
 	getResultsPromise.then(function (data){
 		$scope.results = data;
 	});

 	var PckPromise = Files.getPck(parseQuery, $scope.params);
 	PcksPromise.then(function (res){
 		$scope.pcklst = res;

 		var PckDetailsPromise = Files.getPck( parseQuery, $scope.params );
 		PckDetailsPromise.then( function ( res ) {
 			$scope.pckimgs = res.imgs;
 		} );

 		var getTotalsPromise = Details.getTotals(parseQuery, $scope.pcklst, "pckid", $scope.params);
 		getTotalsPromise.then(function (data){
 			$scope.totals = data;
 		} );


 		var countPckrsPromise = Details.countPckrs(parseQuery, $scope.pcklst, "pckid");
 		countPckrsPromise.then(function (res){
 			$scope.pckrs = res;

 			var getChartTotalsPromise = Details.getChartTotals( parseQuery, $scope.pcklst, "pckid", $scope.params );
 			getChartTotalsPromise.then(function (res){

 				var chart1 = {};
 				chart1.type = "PieChart";
 				chart1.cssStyle = "height:450px; width:400px;";
 				chart1.data = res;

 				chart1.options = {
 					'title': 'Total results with ' + $scope.pckrs[0].usr_count + ' participants',
 					"isStacked": "false",
							"fill": 10,
 					"displayExactValues": true
 				};

 				chart1.formatters = {};

 				$scope.chart1 = chart1;
 			});
 		});

 		$scope.resultsBy = function (){

 			var flt_type = $scope.dfilters[angular.element("#flt_type").val()].type;
 			var flt_opt = angular.element("#flt_opt").val();
 			var chart_type = angular.element("#flt_chart").val() + 'Chart';

 			angular.element("#dresults").show();

 			var pckUsrValsPromise = Details.pckStats(parseQuery, $scope.pcklst, flt_type, flt_opt);
 				pckUsrValsPromise.then(function (res){
 				$scope.usrVals = res;
 			});

 			var pckUsrCntPromise = Details.pckStatsTotals(parseQuery, $scope.pcklst, flt_type, flt_opt);
 				pckUsrCntPromise.then(function (res){
 				$scope.usrCnts = res;

 				var MChartPromise = Details.pckChartStats(parseQuery, $scope.pcklst, flt_type, flt_opt, $scope.params);
 				MChartPromise.then(function (res){

 					var chart2 = {};
 					chart2.type = chart_type;
 					chart2.data = res;

 					chart2.options = {
 						'title': 'Results by ' + flt_type + ': ' + flt_opt,
 						"isStacked": "false",
 						"fill": 10,
 						"displayExactValues": true
 					};

 					chart2.formatters = {};

 					$scope.chart2 = chart2;

 				});
 			});

 		};

 	});

 }] );

pikrAppControllers.controller( 'userCtrl', ['$scope', 'parseQuery', '$location', '$routeParams', 'users', '$timeout', 'Facebook', 
function ( $scope, parseQuery, $location, $routeParams, users, $timeout, Facebook  ) {

		angular.element( "#loginbox, #join, #intro" ).show();
		angular.element( "#mypicks, #logoutbox, #details, #totals, #usrmsg" ).hide();
			
		$scope.pikrFBLink = function () {

			Parse.FacebookUtils.init( { appId: parsefbint } );

			var fblinkusrpromise = users.userFBLink( Facebook );
			fblinkusrpromise.then( function ( res ) {
				$scope.fbusrstatus = res;
			});

		};
		$scope.pikrFBUnlink = function () {

			Parse.FacebookUtils.init( { appId: parsefbint } );

			var fblunlinkusrpromise = users.userFBUnlink( Facebook );
			fblunlinkusrpromise.then( function ( res ) {
				$scope.fbusrstatus = res;
			});

		};
		$scope.pikrFBLogin = function () {

			Parse.FacebookUtils.init( { appId: parsefbint } );

			var fbusrpromise = users.userFBLogin( Facebook );
			fbusrpromise.then( function ( res ) {
				$scope.fbusr = res;
				$scope.fbusrstatus = "Connected to Facebook";

				Facebook.api( '/me?fields=friends.fields(name,gender,username, first_name, last_name).limit(5)', function ( response ) {
					$scope.fbfriends = response.friends.data;

				} );

			});

		};

		var stspromise = users.getUsrStatus();
		stspromise.then( function ( res ) {
			$scope.status = res;

			if ( res != "nobody" ) {
				angular.element( "#usrstatus" ).html( res );
				angular.element( "#loginbox, #join, #intro" ).hide();
				angular.element( "#mypicks, #logoutbox, #details, #totals" ).show();
			}

		} );
		$scope.userSignup = function () {
			var fname = angular.element( "#fnametxt" ).val();
			var lname = angular.element( "#lnametxt" ).val();
			var gndr = angular.element( "#gndrtxt" ).val();
			var status = angular.element( "#statustxt" ).val();
			var prof = angular.element( "#proftxt" ).val();
			var pw = angular.element( "#usrpwtxt" ).val();
			var pw2 = angular.element( "#usrpwtxt2" ).val();
			var usr = angular.element( "#usrnametxt" ).val();
			var email = angular.element( "#emailtxt" ).val();

			var bday = new Date( angular.element( "#bdaytxt" ).val() )

			var usrpromise = users.userSignUp( usr, email, pw, pw2, fname, lname, gndr, status, prof, bday );
			usrpromise.then( function ( res ) {
				$scope.status = res;
				$location.path( '/pikr/' + res );
			} );
		};
		$scope.login = function () {

			var pw = angular.element( "#pwtxt" ).val();
			var usr = angular.element( "#usrtxt" ).val();

			var loginpromise = users.userLogin( usr, pw );
			loginpromise.then( function ( res ) {
				$location.path( '/pikr/' + usr );
				$scope.status = res;
				angular.element( "#usrstatus" ).html( res );
				angular.element( "#mypicks" ).show();
				angular.element( "#loginbox, #join" ).hide();
			} );

		};
		$scope.logout = function () {
			var logoutpromise = users.userLogout();
			logoutpromise.then( function ( res ) {
				$location.path( '/pikr' );
				$scope.status = res;
				angular.element( "#usrstatus" ).html( res );
				angular.element( "#loginbox, #join" ).show();
				angular.element( "#mypicks" ).hide();
				angular.element( "#usrtxt, #pwtxt" ).val( '' );
			} );

		};
		$scope.clear = function () {
			angular.element( "#fnametxt" ).val( "" );
			angular.element( "#lnametxt" ).val( "" );
			angular.element( "#usrtxt" ).val( "" );
			angular.element( "#bdaytxt" ).val( "" );
			angular.element( "#gndrtxt" ).val( "" );
			angular.element( "#statustxt" ).val( "" );
			angular.element( "#proftxt" ).val( "" );
			angular.element( "#pwtxt" ).val( "" );
			angular.element( "#emailtxt" ).val( "" );
		};
		var usrdetailspromise = users.getUsrDetails();
		usrdetailspromise.then( function ( res ) {
			$scope.usr = res;
		} );


	}] );



pikrAppControllers.controller('fbCtrl', ['$scope', 'parseQuery', '$location', '$routeParams', 'users', 'Facebook', '$timeout', 
function ( $scope, parseQuery, $location, $routeParams, users, Facebook, $timeout ) {
  
			$scope.logged = false;
			$scope.byebye = false;
			$scope.salutation = false;

		 //Watch for Facebook to be ready.
			$scope.$watch( function () {
						return Facebook.isReady();
					}, function ( newVal ) {

						if ( newVal ) $scope.facebookReady = true;
					}
			);




			//IntentLogin
			$scope.IntentLogin = function () {
				Facebook.getLoginStatus( function ( response ) {
					if ( response.status == 'connected' ) {
						$scope.logged = true;
						$scope.me();
						$scope.friends();

					}
					else
						$scope.fblogin();
				} );

			};

		 //Login
			$scope.fblogin = function () {

				Facebook.login( function ( response ) {
					if ( response.status == 'connected' ) {

						$scope.logged = true;
						$scope.me();
						$scope.friends();
						
					}

				

				} );

				

			};

			

			//me
			$scope.me = function () {
				Facebook.api( '/me', function ( response ) {
					$scope.$apply( function () {
						$scope.fbuser = response;

					});
				});

			};

			$scope.friends = function () {
				Facebook.api( '/me/friends', function ( response ) {
					$scope.$apply( function () {
						$scope.fbfriends = response;
					} );
				} );

			};


			//logout
			$scope.fblogout = function () {
				Facebook.logout( function () {
					$scope.$apply( function () {
						$scope.fbuser = {};
						$scope.logged = false;
					});
				});
			}

			$scope.$on('Facebook:statusChange', function(ev, data) {
				console.log('Status: ', data);
				if (data.status == 'connected') {
					$scope.$apply(function() {
						$scope.salutation = true;
						$scope.byebye = false;



					});
				} else {
					$scope.$apply(function() {
						$scope.salutation = false;
						$scope.byebye     = true;
            
						// Dismiss byebye message after two seconds
						$timeout(function() {
							$scope.byebye = false;
						}, 2000)
					});
				}
			} );
			

		
  } ]);

pikrAppControllers.controller('filesCtrl', ['$scope', 'parseQuery', 'parsePersistence', 'users', '$upload', 'Files', '$location', '$rootScope', 
	function ($scope, parseQuery, parsePersistence, users, $upload, Files, $location, $rootScope){

	$scope.onFileSelect = function ($files){
 		var filespromise = Files.uploadFile($files[0]);
 		filespromise.then(function (res){
 			$scope.pckimg = res;
 			angular.element("#dropPic").hide();
 			angular.element("#droppedPic, #picForm").css("visibility", "visible");
 			$scope.uploadData = function (){
 				var name = angular.element("#itm_name").val();
 				var descrp = angular.element("#itm_descrp").val();

 				var setfilespromise = Files.setFileData(parseQuery, $scope.pckimg.id, name, descrp);
 				setfilespromise.then(function (data){
 					$scope.txt = data;
 					angular.element("#dropPic").show();
 					angular.element("#droppedPic, picForm").hide();
 					//$location.path('/upload');
 				});

 			};

 		});
 	};

 	var usrfilespromise = Files.getFiles(parseQuery);
 	usrfilespromise.then(function (res){
 		$scope.usr_imgs = res;
 		$scope.pckimgs = 0;
 		$rootScope.imgs = res;
			$scope.opType = "Uploaded";
 	});

 	$scope.countSelectedPic = function (val, usrImg){
 		angular.forEach($scope.usr_imgs, function (img, index) {
 			if ( img.id == usrImg.id ) {
 				$scope.usr_imgs[index].selected = val
 			}
 		});

 		$scope.pckimgs = Files.countSelectedImgs( val, $scope.pckimgs );
 		$rootScope.pckimgs = $scope.pckimgs;
 		$rootScope.imgs = $scope.usr_imgs;
			$scope.opType = "Selected";
 	};

 	$scope.CreatePck = function (){

 		if ($rootScope.pckimgs == 3){
 			
 			var pck = {
 				id: angular.element("#usrpckid").val(),
 				descrp: angular.element("#usrpckdescrp").val(),
 				start: new Date( angular.element( "#startdate" ).val() + ' ' + angular.element( "#starttime" ).val()),
 				end: new Date( angular.element( "#enddate" ).val() + ' ' + angular.element( "#endtime" ).val()),
 				imgs: Files.createImgLst( $rootScope.imgs )
 			};

 			var createpckpromise = Files.createPck(parsePersistence, pck);
 			createpckpromise.then(function (res){
 				$scope.newpck = res;
 			});
 		}
 		else{
 			alert('You pck must include 3 pictures');
 		}
 };

} ]);	

