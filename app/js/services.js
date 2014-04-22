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
pikrAppServices.factory('Name', function (){
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
pikrAppServices.service('Submit', function ($q){
		
		this.upload= function (parsePersistence, usr, id, picks, txt ) {
			
			var user = Parse.User.current();
			if (user) {
					var pikrObject = parsePersistence.new('pikrObject');
					var deferred = $q.defer();
					parsePersistence.save(pikrObject, 
					{		
							username: user.get("username"), 
							pckid: id,  
							comments: txt, 
							submitted:true
						}).then(function(pikrObject) { 
							
									pikrObject.set("user",		user);
									var len = picks.length - 1;
									deferred.resolve(pikrObject.id);	 	
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
									picksObject.set("user",		user);
									picksObject.save();	
									deferred.resolve(pikrObject.id);	

  					});
									
						}, function(error) {
								alert(error) ;
						});
						return deferred.promise;
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
												parent: object.get('parent'),
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

			var innerQuery = parseQuery.new('User');
			var query = parseQuery.new('pikrObject').ascending(fld);	
			query.matchesQuery("user", innerQuery);
			var deferred = $q.defer();
		
			query.find(query).then(function(results) {
				
						var pcks = new Array();
						for (var i = 0; i < results.length; i++) { 
										var object = results[i];
										var pck = 
										{
												id: object.id, 
												user: object.get('username'),
												pckid: object.get('pckid'),
												comments: object.get('comments'),
												submitted: object.get('submitted').toString(),
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
		this.pckStats = function (parseQuery, pcklst, fld, fld_val){

				var innerQuery = parseQuery.new('User').equalTo(fld, fld_val);
				var query = parseQuery.new('picksObject').descending('item'); 
				var total = new Array();
				var deferred = $q.defer();
				
				query.matchesQuery("user", innerQuery);
				query.find(query).then(function(results) {	
					angular.forEach(pcklst, function(value, key){
							var items = value.items;
							
							angular.forEach(items, function(item, k){
								var val = 0;
								var desc;
							
								for (var i = 0; i < results.length; i++) { 
											var object = results[i];	
											if(value.pckid == object.get('pckid') && item == object.get('item')){
														val += 	object.get('val');				
														desc = object.get('descrp');
											}		
									}
																		
									total.push({
										pckid: value.pckid,
										type: fld_val,
										item: item,
										val: val, 
										descrp: desc
								});
														
						});
						
						deferred.resolve(total);
	
				});
																					
		});

		return deferred.promise;
}
this.pckStatsTotals = function (parseQuery, pcklst, fld, val){
	
				var total = new Array();
				var deferred = $q.defer();

				angular.forEach(pcklst, function(value, key){
						
					var innerQuery = parseQuery.new('User').equalTo(fld, val);
					var query = parseQuery.new('pikrObject').equalTo('pckid', value.pckid );	
					query.matchesQuery("user", innerQuery);
					query.count(query).then(function(results) {
														
										total.push({ pckid: value.pckid, count: results});	
	
						}, function(error) {
								console.log(JSON.stringify(error));
						});

						deferred.resolve(total);			
				
				});			
					
			
																					

				return deferred.promise;
}


		this.pckSubmittedStatus = function (parseQuery, params){

					var deferred = $q.defer();
					var currentUser = Parse.User.current();
					var query = parseQuery.new('pikrObject').equalTo('pckid', params.id);
					query.containedIn("username", [params.user]);	

						query.count(query).then(function(results) {
								console.log(params.user + ", " + params.id + ", " + currentUser.id + ", "+ results);
								
								if (results == 0){	
											deferred.resolve('/pikr/' + params.id + '/' + params.user);
								}
								else
								{
											deferred.resolve('/usrmsg');
								}
								
						}, function(error) {
								//deferred.rejected(JSON.stringify(error));
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
								angular.forEach(items, function(item, k){
											var val = 0;
											var desc;
											for (var i = 0; i < results.length; i++) { 
														var object = results[i];	
														if(value.pckid == object.get('pckid') && item == object.get('item')){
																	val += 	object.get('val');				
																	desc = object.get('descrp');
														}		
											}
																		
											total.push({
												pckid: value.pckid,
												item: item,
												val: val, 
												descrp: desc
										});
														
							});
						
							deferred.resolve(total);
	
					});
																					
			});
							
			return deferred.promise;	
					
			}	
		this.countPckrs = function(parseQuery, pcklst, fld){
				
				var deferred = $q.defer();
				var total = new Array();
				angular.forEach(pcklst, function(value, key){
						
					var query = parseQuery.new('pikrObject').equalTo(fld, value.pckid );	
					query.count(query).then(function(results) {
														
										total.push({ pckid: value.pckid, count: results});	
											
	
						}, function(error) {
								console.log(JSON.stringify(error));
						});

						deferred.resolve(total);			
				
				});			
				
				return deferred.promise;

			}
});
pikrAppServices.service('users', function ($q){		
	this.userSignUp= function (usr, email, pw, fname, lname, gndr, status, prof, bday ) {
			
			var user = new Parse.User();
			
			user.set("username", usr);
			user.set("password", pw);
			user.set("email", email);	
			user.set("firstname", fname);
			user.set("lastname", lname);
			user.set("gender", gndr);
			user.set("status", status);
			user.set("profession", prof);
			user.set("birthday", bday);

			var deferred = $q.defer();
			user.signUp(null, {
					success: function(user) {
							deferred.resolve(user.get('username'));	
					},
					error: function(user, error) {
							alert("Error: " + error.code + " " + error.message);
					}
			});
			
			return deferred.promise;
		}	
	this.userLogin= function (usr, pw) {
			
			var deferred = $q.defer();
			Parse.User.logIn(usr, pw, {
			success: function(user) {
					deferred.resolve( usr );	
			},
			error: function(user, error) {
					alert("Error: " + error.code + " " + error.message);
			}
		});
	
		return deferred.promise;
	}  

	this.userLogout= function () {
			
			var deferred = $q.defer();
		
			Parse.User.logOut()
			var currentUser = Parse.User.current();
				if (currentUser) {
								deferred.resolve(currentUser.get("username") );
				} else {
								deferred.resolve('nobody');
				}
	
		return deferred.promise;
	}  

	this.getUsrStatus= function () {
			
			var deferred = $q.defer();
			var currentUser = Parse.User.current();
				if (currentUser) {
								deferred.resolve(currentUser.get("username") );
				} else {
								deferred.resolve('nobody');
				}
			
			return deferred.promise;
	}
	this.getUsrID =  function () {
			
			var deferred = $q.defer();
			var currentUser = Parse.User.current();
			if (currentUser) {
							deferred.resolve(currentUser.id );
			} 
			return deferred.promise;
	}    
});