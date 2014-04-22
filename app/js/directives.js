'use strict';

/* Directives */
var pikrAppDirectives = angular.module('pikrAppDirectives', []);


pikrAppDirectives.directive('draggable', function ()
{
	return function (scope, element)
	{
		var el = element[0];

		el.draggable = true;

		el.addEventListener('dragstart', function (e)
		{
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.clearData('item');
			e.dataTransfer.clearData('start');
			e.dataTransfer.setData('item', this.id);
			e.dataTransfer.setData('start', this.parentNode.id);

			this.classList.add('drag');
			return false;
		}, false);

		el.addEventListener('dragend', function (e)
		{
			this.classList.remove('drag');
			return false;
		}, false);
	}
});
pikrAppDirectives.directive('droppable', function ()
{
	return {
		scope: {
			drop: '&',
			bin: '='
		},
		link: function (scope, element, attributes)
		{
			var el = element[0];
			el.addEventListener('dragover', function (e)
			{
				e.dataTransfer.dropEffect = 'move';
				if (e.preventDefault) e.preventDefault(); // allows us to drop
				this.classList.add('over');
				return false;
			}, false);

			el.addEventListener('dragenter', function (e)
			{
				this.classList.add('over');
				return false;
			}, false);

			el.addEventListener('dragleave', function (e)
			{

				this.classList.remove('over');
				return false;
			}, false);

			el.addEventListener('drop', function (e)
			{
				if (e.stopPropagation) e.stopPropagation(); // Stops some browsers from redirecting.							
				this.classList.remove('over');

				var binId = this.id;
				var item = document.getElementById(e.dataTransfer.getData('item'));
				var start = document.getElementById(e.dataTransfer.getData('start'));
				
				if(this.children.length > 0)
				{
						angular.element('#' + start.id).append(this.children[0]);
				}
					
				this.appendChild(item);

				scope.$apply(function (scope)
				{
					var fn = scope.drop();
					if ('undefined' !== typeof fn)
					{
						fn(item.id, binId);
					}
				});

				return false;
			}, false);
		}
	}
});

pikrAppDirectives.directive('pckrDetails', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/details.html'
	};
});

pikrAppDirectives.directive('pckrDetail', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/detail.html'
	};
});

pikrAppDirectives.directive('pckrTotals', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/totals.html'
	};
});

pikrAppDirectives.directive('pckrFilter', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/filter.html'
	};
});

pikrAppDirectives.directive('pckForm', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/pckform.html'
	};
});

pikrAppDirectives.directive('pckNav', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/nav.html'
	};
});

pikrAppDirectives.directive('pckLogin', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/login.html'
	};
});

pikrAppDirectives.directive('pckLogout', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/logout.html'
	};
});

pikrAppDirectives.directive('pckStatus', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/status.html'
	};
});

pikrAppDirectives.directive('pckData', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/pickdata.html'
	};
});

pikrAppDirectives.directive('pckLogo', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/logo.html'
	};
});

pikrAppDirectives.directive('pckMypcks', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/mypcks.html'
	};
});

pikrAppDirectives.directive('pckMsg', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/usrmsg.html'
	};
});


pikrAppDirectives.directive('pckResultsby', function ()
{
	return {
		transclude: true,
		templateUrl: 'partials/resultsby.html'
	};
});
