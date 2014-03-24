var pikrAppServices = angular.module('pikrAppServices', ['ngResource']);
 
pikrAppServices.factory('picks', ['$resource', function($resource){				
	return $resource('data/:id.json', {}, {
		getpicks: {method:'GET', params:{ID:'pick'}, isArray:true}
	});
}]);

pikrAppServices.factory('pcklst', ['$resource', function($resource){				
	return $resource('data/pcks.json', {}, {
		getPcklst: {method:'GET', params:{ID:'pick'}, isArray:true}
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
							val: len - index + 1
						});		
				
				picksObject.set("parent", pikrObject);
				picksObject.save();	
  	});
			return " (saved)";	
		
		}
		
	}
});


pikrAppServices.service('Details', function ($q){
		this.getResults= function (parseQuery, fld) {
				
			var query = parseQuery.new('picksObject');	
			var deferred = $q.defer();
		
			query.find(query).then(function(results) {
				
						var result = new Array();
						for (var i = 0; i < results.length; i++) { 
										var object = results[i];
										var res = 
										{
												id: object.id, 
												parent: object.get('parent').id,
												pckid: object.get('pckid'),
												item: object.get('item'),
												descrp: object.get('descrp'),
												val: object.get('val')			
										};
										result.push(res);
										

						}
				
				deferred.resolve(result);	

			}, function(error) {
					deferred.rejected(JSON.stringify(error));
			});

			return deferred.promise;
		} 
		this.getDetails = function (parseQuery, fld) {
				
			
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
												comments: object.get('comments'),
												created:	object.createdAt
										};
										pcks.push(pck);
										

						}
				
				deferred.resolve(pcks);	

			}, function(error) {
					deferred.rejected(JSON.stringify(error));
			});

			return deferred.promise;

		 } 
		this.pckSubmittedStatus = function (parseQuery, params){

					var pckid_query = parseQuery.new('pikrObject').equalTo('pckid', params.id);	
					var user_query = parseQuery.new('pikrObject').equalTo('user', params.user);
					var query = Parse.Query.or(pckid_query, user_query);
					var deferred = $q.defer();

						query.count(query).then(function(results) {
								angular.element("#submit").show();
								if(results > 0)
								{									
											deferred.resolve("You already submitted this Pick.");
											angular.element("#submit").hide();
								}


						}, function(error) {
								deferred.rejected(JSON.stringify(error));
						});

						return deferred.promise;

		}
		
		this.getTotals = function (parseQuery, pcklst, fld){

				var query = parseQuery.new('picksObject').ascending(fld);	
				var total = new Array();
				var deferred = $q.defer();
								query.find(query).then(function(results) {
												
										angular.forEach(pcklst, function(value, key){
												var items = value.items;

												for (var j = 0; j < items.length; j++) { 
															var val = 0;
															var desc;
															for (var i = 0; i < results.length; i++) { 
																		var object = results[i];	
																		if(value.pckid == object.get('pckid') && items[j] == object.get('item')){
																					val += 	object.get('val');				
																					desc = object.get('descrp');
																		}	
																		
															}
																		
															total.push({
																pckid: value.pckid,
																item: items[j],
																val: val, 
																descrp: desc
														});
														
											}
						
											deferred.resolve(total);
	
									});
																					
							});
							
							return deferred.promise;	
					
			}	

			this.countPckrs = function(parseQuery, pcklst, fld)
			{
				
				var deferred = $q.defer();
				var total = new Array();
				angular.forEach(pcklst, function(value, key){
						
					var query = parseQuery.new('pikrObject').equalTo(fld, value.pckid );	
					query.count(query).then(function(results) {
														
										total.push({ pckid: value.pckid, count: results});	
											
	
						}, function(error) {
								deferred.rejected(JSON.stringify(error));
						});

						deferred.resolve(total);			
				
				});			
				
				return deferred.promise;

			}

});











