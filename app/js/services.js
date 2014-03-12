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
  			name += angular.element("#" + value.bin).children(1).text() + '(' + index + ')';
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
							val: index
						});		
					
				picksObject.set("parent", pikrObject);
				picksObject.save();	
  	});
			
			return ' (Saved)';
		}
	}
});


pikrAppServices.service('Details', function (){


					function getPicks(parseQuery, fld, id, resid) {

						var query = parseQuery.new('picksObject').equalTo(fld, id, resid);
						parseQuery.find(query).then(function(results) {
						var items= '';
							for (var i = 0; i < results.length; i++) { 
									var object = results[i];
									var parent = object.get('parent');
									//items += parent.id + ',' + object.get('pckid') + "," + object.get('item') + ',' + object.get('val')+ '<br>';		
									items +=  object.get('item') + ':' + object.get('val')+ '<br>';
							}

							angular.element("#" + resid).html(items);	
							
						}, function(error) {
								alert(JSON.stringify(error));
						});
				
		 } 

		

		this.getDetails = function (parseQuery, fld, id) {

								var query = parseQuery.new('pikrObject').ascending(fld);
								parseQuery.find(query).then(function(results) {
											
								var tblh = '<tr><th width="5%">id</th><th width="10%">pickid</th><th width="20%">user</th><th width="10%">results</th></tr>';
								angular.element("#details").append('<tr>' + tblh + '</tr>');													
					
								for (var i = 0; i < results.length; i++) { 
										var object = results[i];
										var resid = '#res' + i;
										var tbl = '<td>' + object.id + '</td>';
										tbl+='<td>' + object.get('pckid') + '</td>';
										tbl+='<td>' + object.get('user') + '</td>';
										tbl+='<td id="' + object.get('pckid') +  '"></td>';
										angular.element("#details").append('<tr>' + tbl + '</tr>');
										getPicks(parseQuery, fld, object.get('pckid'), object.get('pckid'));
									}
									
									
											
											
						}, function(error) {
								alert(JSON.stringify(error));
						});

						
		 } 

});





