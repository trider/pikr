var pikrAppServices = angular.module( 'pikrAppServices', ['ngResource'] );
pikrAppServices.factory( 'picks', ['$resource', function ( $resource ) {
	return $resource( 'data/:id.json', {}, {
		getpicks: { method: 'GET', params: { ID: 'pick' }, isArray: true }
	} );
}] );
pikrAppServices.factory( 'pcklst', ['$resource', function ( $resource ) {
	return $resource( 'data/pcks.json', {}, {
		getPcklst: { method: 'GET', params: { ID: 'pick' }, isArray: true }
	} );
}] );
pikrAppServices.factory( 'Name', function () {
	return {
		getName: function ( picks ) {
			var len = picks.length - 1;
			var name = '';
			angular.forEach( picks, function ( value, index ) {
				var val = picks.length - index;
				name += angular.element( "#" + value.bin ).children( 1 ).text() + '(' + val + ')';
				if ( index < len ) {
					name += ',';
				}
			} );
			return name;
		}
	}
} );
pikrAppServices.service( 'Submit', function ( $q ) {

	this.upload = function ( parsePersistence, params, picks, txt ) {

		var user = Parse.User.current();
		if ( user ) {
			var pikrObject = parsePersistence.new( 'pikrObject' );
			var deferred = $q.defer();
			parsePersistence.save( pikrObject,
			{
				username: user.get( "username" ),
				pckid: params.id,
				comments: txt,
				submitted: true
			} );

			pikrObject.set( "user", user );
			var len = picks.length - 1;
			deferred.resolve( pikrObject.id );
			angular.forEach( picks, function ( value, index ) {

				var picksObject = parsePersistence.new( 'picksObject' );
				var name = angular.element( "#" + value.bin ).children( 1 ).text()
				var itm = name.slice( name.indexOf( 'Item' ), name.indexOf( ':' ) );

				parsePersistence.save( picksObject,
					{
						pckid: params.id,
						item: itm,
						descrp: name,
						val: len - index + 1
					} );

				picksObject.set( "parent", pikrObject );
				picksObject.set( "user", user );
				picksObject.save();


			} );

			deferred.resolve( pikrObject.id );

		}
		return deferred.promise;
	}
} );
pikrAppServices.service( 'Details', function ( $q ) {

	this.getPcks = function ( parseQuery ) {

		var deferred = $q.defer();
		var query = parseQuery.new( 'pckObject' );
		query.find( query ).then( function ( results ) {

			var result = new Array();
			for ( var i = 0; i < results.length; i++ ) {
				var object = results[i];
				result.push( {
					id: object.id,
					pckid: object.get( 'pckid' ),
					descrp: object.get( "descrp" ),
					start: object.get( "start" ),
					end: object.get( "end" ),
					imgs: object.get( "imgs" )
				} );
			}

			deferred.resolve( result );


		}, function ( error ) {
			deferred.rejected( JSON.stringify( error ) );
		} );

		return deferred.promise;
	}




	this.getResults = function ( parseQuery, fld ) {

		var query = parseQuery.new( 'picksObject' );
		var deferred = $q.defer();

		query.find( query ).then( function ( results ) {

			var result = new Array();
			for ( var i = 0; i < results.length; i++ ) {
				var object = results[i];
				result.push( {
					id: object.id,
					parent: object.get( 'parent' ),
					pckid: object.get( 'pckid' ),
					item: object.get( 'item' ),
					descrp: object.get( 'descrp' ),
					val: object.get( 'val' )
				} );
			}
			deferred.resolve( result );

		}, function ( error ) {
			deferred.rejected( JSON.stringify( error ) );
		} );

		return deferred.promise;
	}
	this.getDetails = function ( parseQuery, fld ) {

		var innerQuery = parseQuery.new( 'User' );
		var query = parseQuery.new( 'pikrObject' ).ascending( fld );
		query.matchesQuery( "user", innerQuery );
		var deferred = $q.defer();

		query.find( query ).then( function ( results ) {

			var pcks = new Array();
			for ( var i = 0; i < results.length; i++ ) {
				var object = results[i];
				pcks.push( {
					id: object.id,
					user: object.get( 'username' ),
					pckid: object.get( 'pckid' ),
					comments: object.get( 'comments' ),
					submitted: object.get( 'submitted' ).toString(),
					created: object.createdAt
				} );
			}
			deferred.resolve( pcks );

		}, function ( error ) {
			deferred.rejected( JSON.stringify( error ) );
		} );

		return deferred.promise;

	}
	this.pckStats = function ( parseQuery, pcklst, fld, fld_val ) {

		var innerQuery = parseQuery.new( 'User' ).equalTo( fld, fld_val );
		var query = parseQuery.new( 'picksObject' ).descending( 'item' );
		var total = new Array();
		var deferred = $q.defer();

		query.matchesQuery( "user", innerQuery );
		query.find( query ).then( function ( results ) {
			angular.forEach( pcklst, function ( value, key ) {
				var items = value.items;
				angular.forEach( items, function ( item, k ) {
					var val = 0;
					var desc;

					for ( var i = 0; i < results.length; i++ ) {
						var object = results[i];
						if ( value.pckid == object.get( 'pckid' ) && item == object.get( 'item' ) ) {
							val += object.get( 'val' );
							desc = object.get( 'descrp' );
						}
					}

					total.push( {
						pckid: value.pckid,
						type: fld_val,
						item: item,
						val: val,
						descrp: desc
					} );

				} );

				deferred.resolve( total );

			} );

		} );

		return deferred.promise;
	}
	this.pckStatsTotals = function ( parseQuery, pcklst, fld, val ) {

		var total = new Array();
		var deferred = $q.defer();

		angular.forEach( pcklst, function ( value, key ) {

			var innerQuery = parseQuery.new( 'User' ).equalTo( fld, val );
			var query = parseQuery.new( 'pikrObject' ).equalTo( 'pckid', value.pckid );
			query.matchesQuery( "user", innerQuery );
			query.count( query ).then( function ( results ) {

				total.push( { pckid: value.pckid, usr_count: results } );

			}, function ( error ) {
				console.log( JSON.stringify( error ) );
			} );

			deferred.resolve( total );

		} );

		return deferred.promise;
	}
	this.pckSubmittedStatus = function ( parseQuery, params ) {

		var deferred = $q.defer();
		var currentUser = Parse.User.current();
		var query = parseQuery.new( 'pikrObject' ).equalTo( 'pckid', params.id );
		query.containedIn( "username", [params.user] );

		query.count( query ).then( function ( results ) {
			//console.log(params.user + ", " + params.id + ", " + currentUser.id + ", "+ results);

			if ( results == 0 ) {
				deferred.resolve( '/pikr/' + params.id + '/' + params.user );
			}
			else {
				deferred.resolve( '/usrmsg/' );
			}

		}, function ( error ) {
			//deferred.rejected(JSON.stringify(error));
		} );

		return deferred.promise;

	}
	this.getTotals = function ( parseQuery, pcklst, fld, params ) {
		var query = parseQuery.new( 'picksObject' ).ascending( fld );
		var total = new Array();
		var deferred = $q.defer();
		query.find( query ).then( function ( results ) {

			angular.forEach( pcklst, function ( value, key ) {
				var items = value.imgs;
				angular.forEach( items, function ( item, k ) {
					var val = 0;
					var desc;
					for ( var i = 0; i < results.length; i++ ) {
						var object = results[i];
						if ( value.pckid == object.get( 'pckid' ) && item.item == object.get( 'item' ) ) {
							val += object.get( 'val' );
							desc = object.get( 'descrp' );
						}
					}

					total.push( {
						pckid: value.pckid,
						item: item.item,
						val: val,
						descrp: desc
					});

				} );
				deferred.resolve( total );
			} );

		} );

		return deferred.promise;

	}


	this.getChartTotals = function ( parseQuery, pcklst, fld, params ) {

		var query = parseQuery.new( 'picksObject' ).equalTo( fld, params.id );
		var total = new Array();
		var deferred = $q.defer();
		query.find( query ).then( function ( results ) {

			angular.forEach( pcklst, function ( value, key ) {
				var items = value.imgs;
				
				angular.forEach( items, function ( itm, k ) {
					var val = 0;
					for ( var i = 0; i < results.length; i++ ) {
						var object = results[i];
						if ( object.get( 'pckid' ) == value.pckid && itm.item == object.get( 'item' ) ) {
							val += object.get( 'val' );
						}
					}

					total.push( { c: [{ v: itm.item }, { v: val }] } );
					

				} );

				var totals = {
					"cols": [
						{ id: "Item", label: "Item", type: "string" },
						{ id: "Value", label: "Value", type: "number" }
					], "rows": total
				};

				deferred.resolve( totals );

			} );

		} );

		return deferred.promise;

	}

	this.pckChartStats = function ( parseQuery, pcklst, fld, fld_val, params ) {
	
		var innerQuery = parseQuery.new( 'User' ).equalTo( fld, fld_val );
		var query = parseQuery.new( 'picksObject' );
		var total = new Array();
		var deferred = $q.defer();
		query.matchesQuery( "user", innerQuery );
		query.find( query ).then( function ( results ) {
			angular.forEach( pcklst, function ( value, key ) {
				if ( params.id == value.pckid ) {

					var items = value.imgs;
					angular.forEach( items, function ( itm, k ) {
					var val = 0;

						for ( var i = 0; i < results.length; i++ ) {
							var object = results[i];
							if ( object.get( 'pckid' ) == value.pckid && itm.item == object.get( 'item' ) ) {
								val += object.get( 'val' );
							}
						}

						total.push( { c: [{ v: itm.item }, { v: val }] } );

					});
				}
				var totals = {
					"cols": [
							{ id: "Items", label: "Item", type: "string" },
							{ id: "Values", label: "Value", type: "number" }
					], "rows": total
				};

				deferred.resolve( totals );
				} );
						


				
		} );

		return deferred.promise;


	}

	this.getChartResults = function ( parseQuery, fld ) {

		var query = parseQuery.new( 'picksObject' );
		var deferred = $q.defer();

		query.find( query ).then( function ( results ) {

			var result = new Array();
			for ( var i = 0; i < results.length; i++ ) {
				var object = results[i];
				result.push( { c: [{ v: object.get( 'item' ) }, { v: object.get( 'val' ) }] } );
			}

			deferred.resolve( result );

		}, function ( error ) {
			deferred.rejected( JSON.stringify( error ) );
		} );

		return deferred.promise;
	}


	this.countPckrs = function ( parseQuery, pcklst, fld ) {

		var deferred = $q.defer();
		var total = new Array();
		angular.forEach( pcklst, function ( value, key ) {

			var query = parseQuery.new( 'pikrObject' ).equalTo( fld, value.pckid );
			query.count( query ).then( function ( results ) {

				total.push( { pckid: value.pckid, usr_count: results } );


			}, function ( error ) {
				console.log( JSON.stringify( error ) );
			} );

			deferred.resolve( total );

		} );

		return deferred.promise;

	}
} );
pikrAppServices.service( 'users', function ( $q ) {
	this.userSignUp = function ( usr, email, pw, pw2, fname, lname, gndr, status, prof, bday ) {

		if ( pw == pw2 ) {
			var user = new Parse.User();

			user.set( "username", usr );
			user.set( "password", pw );
			user.set( "email", email );
			user.set( "firstname", fname );
			user.set( "lastname", lname );
			user.set( "gender", gndr );
			user.set( "status", status );
			user.set( "profession", prof );
			user.set( "birthday", bday );

			var deferred = $q.defer();
			user.signUp( null, {
				success: function ( user ) {
					deferred.resolve( user.get( 'username' ) );
				},
				error: function ( user, error ) {
					alert( "Error: " + error.code + " " + error.message );
				}
			} );
		}
		else {
			alert( "The passwords you typed do not match. Pleae re-enter your password." )
			deferred.resolve( 'nobody' );
		}



		return deferred.promise;
	}
	this.userLogin = function ( usr, pw ) {

		var deferred = $q.defer();
		Parse.User.logIn( usr, pw, {
			success: function ( user ) {
				deferred.resolve( usr );
			},
			error: function ( user, error ) {
				alert( "Error: " + error.code + " " + error.message );
			}
		} );

		return deferred.promise;
	}

	this.userLogout = function () {

		var deferred = $q.defer();

		Parse.User.logOut()
		var currentUser = Parse.User.current();
		if ( currentUser ) {
			deferred.resolve( currentUser.get( "username" ) );
		} else {
			deferred.resolve( 'nobody' );
		}

		return deferred.promise;
	}

	this.getUsrStatus = function () {

		var deferred = $q.defer();
		var currentUser = Parse.User.current();
		if ( currentUser ) {
			deferred.resolve( currentUser.get( "username" ) );
		} else {
			deferred.resolve( 'nobody' );
		}

		return deferred.promise;
	}
	this.getUsrID = function () {

		var deferred = $q.defer();
		var currentUser = Parse.User.current();
		if ( currentUser ) {
			deferred.resolve( currentUser.id );
		}
		return deferred.promise;
	}

	this.getUsrDetails = function () {

		var deferred = $q.defer();
		var currentUser = Parse.User.current();
		if ( currentUser ) {


			var usr =
			{
				usrname: currentUser.get( "username" ),
				password: currentUser.get( "password" ),
				email: currentUser.get( "email" ),
				fname: currentUser.get( "firstname" ),
				lname: currentUser.get( "lastname" ),
				gender: currentUser.get( "gender" ),
				status: currentUser.get( "status" ),
				profession: currentUser.get( "profession" ),
				birthday: currentUser.get( "birthday" ),
				age: getAge( currentUser.get( "birthday" ) )
			};
			deferred.resolve( usr );
		}
		return deferred.promise;
	}

} );
pikrAppServices.service( 'Files', function ( $q ) {
	this.uploadFile = function ( file ) {

		var parseFile = new Parse.File( file.name, file );
		var deferred = $q.defer();

		var currentUser = Parse.User.current();
		if ( currentUser ) {

			parseFile.save().then( function () {
				var pckimg = new Parse.Object( "pckimg" );
				//pckimg.set("item", itm_name);
				//pckimg.set("descrp", itm_descrp);
				pckimg.set( "name", file.name );
				pckimg.set( "file", file );
				pckimg.set( "user", currentUser );
				var img = parseFile.url();
				pckimg.set( "url", img );
				pckimg.save();

				deferred.resolve( {
					id: pckimg.id,
					name: file.name,
					user: currentUser.get( 'username' ),
					url: img
				} );
			} );


		}
		return deferred.promise;

	}
	this.setFileData = function ( parseQuery, id, itm_name, itm_descrp ) {
		var currentUser = Parse.User.current();
		var query = parseQuery.new( 'pckimg' ).equalTo( 'id', id );
		var deferred = $q.defer();

		query.find( query ).then( function ( pckimg ) {
			pckimg[0].set( "item", itm_name );
			pckimg[0].set( "descrp", itm_descrp );
			pckimg[0].save();
			deferred.resolve( "Object updated" );

		}, function ( error ) {
			deferred.rejected( JSON.stringify( error ) );
		} );

		return deferred.promise;

	}
	this.getFiles = function ( parseQuery, descrp ) {

		var currentUser = Parse.User.current();
		var query = parseQuery.new( 'pckimg' ).equalTo( 'user', currentUser );
		var deferred = $q.defer();

		query.find( query ).then( function ( results ) {

			var result = new Array();
			for ( var i = 0; i < results.length; i++ ) {
				var object = results[i];

				result.push( {
					id: object.id,
					name: object.get( 'name' ),
					user: currentUser.get( "username" ),
					descrp: object.get( 'descrp' ),
					url: object.get( 'url' ),
					selected: false
				} );
			}
			deferred.resolve( result );

		}, function ( error ) {
			deferred.rejected( JSON.stringify( error ) );
		} );

		return deferred.promise;
	}



	this.countSelectedImgs = function ( val, pckimgs ) {

		if ( val ) {
			pckimgs++;
		}
		else {
			pckimgs--;
		}
		return pckimgs;

	}
	this.createImgLst = function ( pckImgs ) {

		var imgs = new Array();
		angular.forEach( pckImgs, function ( img, index ) {
			if ( img.selected ) {
				var num = index + 1
				imgs.push( {
					id: img.id,
					item: 'Item' + num,
					bin: 'Bin' + num,
					name: img.name,
					descrp: img.descrp,
					url: img.url
				} );
			}
		} );

		return imgs;

	}


	this.createPck = function ( parsePersistence, pck ) {
		//console.log(pck.imgs);
		var currentUser = Parse.User.current();
		var deferred = $q.defer();
		var pckObject = parsePersistence.new( 'pckObject' );
		if ( currentUser ) {

			pckObject.set( "user", currentUser );
			parsePersistence.save( pckObject, {
				pckid: pck.id,
				descrp: pck.descrp,
				start: pck.start,
				end: pck.end,
				imgs: pck.imgs
			} );

			deferred.resolve( "#/pikr/" + pck.id + "/" + currentUser.get( "username" ) );

		}

		return deferred.promise;
	}

	this.getPck = function ( parseQuery, params ) {

		var deferred = $q.defer();
		var query = parseQuery.new( 'pckObject' ).equalTo( 'pckid', params.id );
		query.find( query ).then( function ( results ) {


			for ( var i = 0; i < results.length; i++ ) {
				var object = results[i];
				deferred.resolve( {
					id: object.id,
					item: object.get( 'item' ),
					pckid: object.get( 'pickid' ),
					descrp: object.get( "descrp" ),
					start: object.get( "start" ),
					end: object.get( "end" ),
					imgs: object.get( "imgs" )
				} );
			}


		}, function ( error ) {
			deferred.rejected( JSON.stringify( error ) );
		} );

		return deferred.promise;
	}

	this.getPcks = function ( parseQuery ) {

		var deferred = $q.defer();
		var query = parseQuery.new( 'pckObject' ).equalTo( 'pckid', params.id );
		query.find( query ).then( function ( results ) {


			for ( var i = 0; i < results.length; i++ ) {
				var object = results[i];
				deferred.resolve( {
					id: object.id,
					item: object.get( 'item' ),
					pckid: object.get( 'pickid' ),
					descrp: object.get( "descrp" ),
					start: object.get( "start" ),
					end: object.get( "end" ),
					imgs: object.get( "imgs" )
				} );
			}


		}, function ( error ) {
			deferred.rejected( JSON.stringify( error ) );
		} );

		return deferred.promise;
	}





} );
function getAge( dateString ) {
	var today = new Date();
	var birthDate = new Date( dateString );
	var age = today.getFullYear() - birthDate.getFullYear();
	//var m = today.getMonth() - birthDate.getMonth();
	//if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
	//{
	//    age--;
	//}
	return age;
}