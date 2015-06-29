angular.module('starter.services', [])
.factory('Auctions', function($http,ApiEndpoint,$rootScope,$q) {
	var _this = this;
	_this.auctions = null;
	_this.data = null;
	_this.auctions = [{}
		/*{ name: 'Sprzedaz paszy', id: 1,f:1 },
		{ name: 'Zakup ciagnikow', id: 2,f:1 },
		{ name: 'Pryetarg na biurka', id: 3,f:1 },
		{ name: 'Aukcja dobrocyznna', id: 4,f:0 },
		{ name: 'Posyukiwania komputerow', id: 5,f:0 },
		{ name: 'Cos tam cos tam', id: 6,f:0 }*/
	  ];
	
	return {
		all: function(){
			return _this.auctions;
		},
		
		fetchAll: function(offers,termin,typ,zoferta){			
			var token = $rootScope.globals.currentUser.token;
			var q = $q.defer();
			var p = {limit:1000};
			
			if(offers) {
				p.offers = 'true'
			}
			
			//1 -trwa ; 2-zakonczone			
			if(termin) {
				if(termin == '2') { p.archive = 'true'; }
			} else { p.archive = 'all'; }
			//1-otwarte;2-zamkniete
			if(typ) {
				if(typ == '1') { p.type = 'open'; }
				if(typ == '2') { p.type = 'close'; }
			}
			if(zoferta) {
				p.hasoffer = true;
			}
			
			$http.get(
				ApiEndpoint.url+'list/'+encodeURIComponent(token), //+'/auctions/0',
				{ params: p })
				.success(function(data) {					
					_this.data = data;					
					q.resolve(data);
				})
				.error(function(error){
					q.reject(error);
				});
			return q.promise;
		},
		fetch: function(offers,termin,typ,zoferta){			
			var token = $rootScope.globals.currentUser.token;
			var q = $q.defer();
			var p = {limit:1000};
			
			if(offers) {
				p.offers = 'true'
			}
			
			//1 -trwa ; 2-zakonczone			
			if(termin) {
				if(termin == '2') { p.archive = 'true'; }
			} else { p.archive = 'all'; }
			//1-otwarte;2-zamkniete
			if(typ) {
				if(typ == '1') { p.type = 'open'; }
				if(typ == '2') { p.type = 'close'; }
			}
			if(zoferta) {
				p.hasoffer = true;
			}
			
			$http.get(
				ApiEndpoint.url+encodeURIComponent(token)+'/auctions/0',
				{ params: p })
				.success(function(data) {					
					_this.data = data;					
					q.resolve(data);
				})
				.error(function(error){
					q.reject(error);
				});
			return q.promise;
		},
		get: function(id){
			var token = $rootScope.globals.currentUser.token;
			var q = $q.defer();
			$http.get(
				ApiEndpoint.url+encodeURIComponent(token)+'/show/'+encodeURIComponent(id))
				.success(function(data) {			
					_this.data = data;					
					q.resolve(data);
				})
				.error(function(error){
					q.reject(error);
				});
			return q.promise;
		},
		offer: function(id){
			var token = $rootScope.globals.currentUser.token;
			var q = $q.defer();
			$http.get(
				ApiEndpoint.url+encodeURIComponent(token)+'/offer/'+encodeURIComponent(id))
				.success(function(data) {			
					_this.data = data;					
					q.resolve(data);
				})
				.error(function(error){
					q.reject(error);
				});
			return q.promise;		
		},
		newoffer: function(aid,value){
			var q = $q.defer();	
			var token = $rootScope.globals.currentUser.token;
			$http.post(ApiEndpoint.url+'n_off',{ aid: aid, value: value, token: token })
				.success(function(data) {
					q.resolve(data);
				})
				.error(function(error){
					q.reject(error);
				});
			return q.promise;
		}
	}
})

.factory('AuthenticationService', function($rootScope,$localstorage,$http, $q, ApiEndpoint) {
	return {
		username: function() {
			return $rootScope.globals.currentUser.username;
		},
		token: function() {
			return $rootScope.globals.currentUser.token;
		},
		Login: function(username,password){
			var q = $q.defer();			
			//$http.post(ApiEndpoint.url+'login',{ timeout: 5000,username: username, password: password }) 
			//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$http.post(ApiEndpoint.url+'login',{ username: username, password: password })

				.success(function(data) {
					q.resolve(data);
				})
				.error(function(error){
					q.reject(error);
				});
			return q.promise;
		},
		SetCredentials: function (username, token) {  
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    token: token
                },			
            };
            $localstorage.setObject('globals', $rootScope.globals);
        },  
        ClearCredentials: function () {
            $rootScope.globals = {};
            $localstorage.setObject('globals', null);
        }
	}
})
;