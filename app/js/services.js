var pikrAppServices = angular.module('pikrAppServices', ['ngResource']);
 
pikrAppServices.factory('picks', ['$resource', function($resource){				
	return $resource('data/:id.json', {}, {
		getpicks: {method:'GET', params:{ID:'pick'}, isArray:true}
	});
}]);


pikrAppServices.factory('Name', function ()
{
	return {
		getName: function (picks){
  		var len = picks.length - 1;
  		var name = '';
  		angular.forEach(picks, function (value, index)
  		{
  			var val = picks.length - index;
					name += angular.element("#" + value.bin).children(1).text() + '(' + val + ')';
  			if (index < len)
  			{
  				name += ',';
  			}
  		});
  		return name;
			}
		}
});

pikrAppServices.factory('Submit', function (){
	return {
		upload: function (parsePersistence, usr, id, picks, txt){

			var pikrObject = parsePersistence.new('pikrObject');
			parsePersistence.save(pikrObject, { user: usr, pckid: id,  comments: txt, submitted:true});
			
			var len = picks.length - 1;
  	angular.forEach(picks, function (value, index){
  		
				var picksObject = parsePersistence.new('picksObject');
				var name = angular.element("#" + value.bin).children(1).text()
				var itm = name.slice(name.indexOf('Item'), name.indexOf(':'));
				
				parsePersistence.save(picksObject, 
					{ pckid: id, 
							item: itm,
							descrp: name, 
							val: picks.length - index
						});		
					
				picksObject.set("parent", pikrObject);
				picksObject.save();	
  	});
			
			return ' (Saved)';
		}
	}
});


pikrAppServices.service('Details', function ($q){


					function getPicks(parseQuery, fld, id) {

						var query = parseQuery.new('picksObject').equalTo(fld, id);
						var deferred = $q.defer();
						parseQuery.find(query).then(function(results) {

						//var items= '';
						//	for (var i = 0; i < results.length; i++) { 
						//			var object = results[i];
						//			var parent = object.get('parent').id;
						//			if(i>0)
						//			{
						//					items += ', ';
						//			}
						//			items +=  object.get('item') + ':' + object.get('val');
						//	}

							//angular.element("#" + id).html(items);	
							//console.log(items);
							deferred.resolve(results);
							//return results;	
							
						}, function(error) {
									//deferred.rejected(JSON.stringify(error));
						});

						return deferred.promise;
				
		 } 

		this.getDetails = function (parseQuery, fld, id) {
				
			
			var query = parseQuery.new('pikrObject').ascending(fld);	
			var deferred = $q.defer();
		
			query.find(query).then(function(results) {
				
						var pcks = new Array();
						for (var i = 0; i < results.length; i++) { 
										var object = results[i];
										var pck = 
										{
												id: object.id, 
												user: object.get('user'),
												pckid: object.get('pckid'),
												result: '',
												comments: object.get('comments')			
										};
										pcks.push(pck);
										

						}
				
				deferred.resolve(pcks);	

			}, function(error) {
					deferred.rejected(JSON.stringify(error));
			});

			return deferred.promise;

		 } 


			this.pckSubmittedStatus = function (parseQuery, params)
			{

					var pckid_query = parseQuery.new('pikrObject').equalTo('pckid', params.id);	
					var user_query = parseQuery.new('pikrObject').equalTo('user', params.user);
					var query = Parse.Query.or(pckid_query, user_query);
					var deferred = $q.defer();

						query.count(query).then(function(results) {
						
								if(results > 0)
								{									
											deferred.resolve("You already submitted this Pick. " + results);
								}

						}, function(error) {
								deferred.rejected(JSON.stringify(error));
						});

						return deferred.promise;

		}



});









