var pikrAppControllers = angular.module('pikrAppControllers', []);

pikrAppControllers.controller('pikrCtrl', ['$scope', '$location',
  function ($scope, $location)
  {
			 
			angular.element("#cnt").hide();
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

  		$scope.bin1 = angular.element("#bin1").children().length;
  		$scope.bin2 = angular.element("#bin2").children().length;
  		$scope.bin3 = angular.element("#bin3").children().length;
  		
				if($scope.bin1 > 1 || $scope.bin2 > 1 || $scope.bin2 > 1)
				{
						angular.element("#droptxt").html('Only one picture allowed per box.<br>');
				}
				else
				{
				 angular.element("#cnt").show();
					angular.element("#bin1caption").text('First');
					angular.element("#bin2caption").text('Second');
					angular.element("#bin3caption").text('Third'); 	
					angular.element("#droptxt").html('Submitted.<br>');
				}
				
  	}





  } ]);