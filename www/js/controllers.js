angular.module('starter.controllers', [])
.controller('AppCtrl', function(AuthenticationService, $scope, $rootScope, $ionicModal, $timeout, $localstorage, $state,$ionicHistory) {
	//$rootScope.globals.currentUser
	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.user = {
			name : AuthenticationService.username(),
			token : AuthenticationService.token()
		};	
		$scope.logged = AuthenticationService.username();
	});	

	// Form data for the login modal
	//$scope.loginData = {};
	//$rootScope.test
	//$rootScope.user = $localstorage.getObject('user');
	//$rootScope.logged = $rootScope.user;
	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
	};
	// Open the login modal
	$scope.login = function() {
		$scope.modal.show();
	};
	$scope.logoff = function() {	
		AuthenticationService.ClearCredentials();
		$state.go('login', null, {reload: true});
		return;
	
		$localstorage.setObject('user', null);
		console.log($localstorage.getObject('user'));
		$rootScope.user = null;
		$rootScope.logged = $rootScope.user;
		console.log($rootScope.user);
		$ionicHistory.clearHistory();
		//$location.url('/app/default');
		$state.go('login', null, {reload: true});
	};
	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {		
		console.log('Doing login', $scope.loginData);
		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$rootScope.user = {
			name : $scope.loginData.username,
			token : 'XYZ'
		};
		$localstorage.setObject('user', $rootScope.user);
		$rootScope.logged = $rootScope.user;
		//$location.url('/app/auctions');
		$ionicHistory.clearHistory();
		$state.go('app.auctions', null, {reload: true});
		
		$timeout(function() {
			$scope.closeLogin();
			console.log($rootScope.user);
			//$location.url('/app/default');
		}, 1000);
	};
})
.controller('AllAuctionsCtrl', function($scope, $ionicLoading, Auctions, $location, $stateParams) {	
	$scope.noTermin = function() {
		$scope.termin.choice = null;
	}
	$scope.noTyp = function() {
		$scope.typ.choice = null;
	}
	$scope.noMoje = function() {
		$scope.my.choice = null;
	}

	$scope.filter = false;
	$scope.toggleFilter = function() {
		$scope.filter = !$scope.filter;
	}
	
	$scope.termin = {
		trwa : { value: "bb", count: 0 },
		koniec : { value: "ng", count: 0 }
	};
	$scope.typ = {
		otwarte : { value: "bb", count: 0 },
		zamkniete : { value: "ng", count: 0 }
	};
	$scope.my = {
		zoferta : { count: 0 }
	};
	$scope.auctions = [];

	$scope.refresh = function() {	
		$ionicLoading.show({
			showBackdrop: true
		});
		Auctions.fetchAll(false,$scope.termin.choice,$scope.typ.choice,$scope.my.choice).then(
			function(data) {
				$scope.termin.trwa.count =  data.filterAuctionPhaseCount[0].ongoing || 0;
				$scope.termin.koniec.count =  data.filterAuctionPhaseCount[0].completed || 0;
				$scope.typ.otwarte.count = data.auctionTypeCount[0].open || 0;
				$scope.typ.zamkniete.count = data.auctionTypeCount[0].closed || 0;
				$scope.my.zoferta.count = data.wybranaOferta || 0;
				
				$scope.auctions = data.auctionList.list;
				$ionicLoading.hide();
			},
			function(err) {
				$location.path('/login');
				$ionicLoading.hide();
			}
		);
	};
	
	if($stateParams.t) {
			if($stateParams.t == 't') { $scope.termin.choice = '1' }
			if($stateParams.t == 'f') { $scope.termin.choice = '2' }			
		}
	$scope.refresh();
})
.controller('AuctionsCtrl', function($scope, $ionicLoading, Auctions, $location, $stateParams) {	
	$scope.noTermin = function() {
		$scope.termin.choice = null;
	}
	$scope.noTyp = function() {
		$scope.typ.choice = null;
	}
	$scope.noMoje = function() {
		$scope.my.choice = null;
	}

	$scope.filter = false;
	$scope.toggleFilter = function() {
		$scope.filter = !$scope.filter;
	}
	
	$scope.termin = {
		trwa : { value: "bb", count: 0 },
		koniec : { value: "ng", count: 0 }
	};
	$scope.typ = {
		otwarte : { value: "bb", count: 0 },
		zamkniete : { value: "ng", count: 0 }
	};
	$scope.my = {
		zoferta : { count: 0 }
	};
	$scope.auctions = [];

	$scope.refresh = function() {	
		$ionicLoading.show({
			showBackdrop: true
		});
		Auctions.fetch(false,$scope.termin.choice,$scope.typ.choice,$scope.my.choice).then(
			function(data) {
				$scope.termin.trwa.count =  data.filterAuctionPhaseCount[0].ongoing || 0;
				$scope.termin.koniec.count =  data.filterAuctionPhaseCount[0].completed || 0;
				$scope.typ.otwarte.count = data.auctionTypeCount[0].open || 0;
				$scope.typ.zamkniete.count = data.auctionTypeCount[0].closed || 0;
				$scope.my.zoferta.count = data.wybranaOferta || 0;
				
				$scope.auctions = data.auctionList.list;
				$ionicLoading.hide();
			},
			function(err) {
				$location.path('/login');
				$ionicLoading.hide();
			}
		);
	};
	
	if($stateParams.t) {
			if($stateParams.t == 't') { $scope.termin.choice = '1' }
			if($stateParams.t == 'f') { $scope.termin.choice = '2' }			
		}
	$scope.refresh();
}).controller('AuctionCtrl', function($scope, $stateParams, Auctions, $ionicLoading ) {
	$scope.model = {};
		$ionicLoading.show({
			showBackdrop: true
		});
		Auctions.get($stateParams.auctionId).then(
			function(data) {
				$scope.model = data;
				console.log($scope.model);
				$ionicLoading.hide();
			},
			function(err) {
				//console.log(err);
				$location.path('/login');
				$ionicLoading.hide();
			}
		);
	
})

.controller('OffersCtrl', function($scope, $ionicLoading, Auctions, $location, $stateParams) {	
	$scope.noTermin = function() {
		$scope.termin.choice = null;
	}
	$scope.noTyp = function() {
		$scope.typ.choice = null;
	}
	$scope.noMoje = function() {
		$scope.my.choice = null;
	}

	$scope.filter = false;
	$scope.toggleFilter = function() {
		$scope.filter = !$scope.filter;
	}
	
	$scope.termin = {
		trwa : { value: "bb", count: 0 },
		koniec : { value: "ng", count: 0 }
	};
	$scope.typ = {
		otwarte : { value: "bb", count: 0 },
		zamkniete : { value: "ng", count: 0 }
	};
	$scope.my = {
		zoferta : { count: 0 }
	};
	$scope.offers = [];

	$scope.refresh = function() {	
		$ionicLoading.show({
			showBackdrop: true
		});
		Auctions.fetch(true,$scope.termin.choice,$scope.typ.choice,$scope.my.choice).then(
			function(data) {
				$scope.termin.trwa.count =  data.filterAuctionPhaseCount[0].ongoing || 0;
				$scope.termin.koniec.count =  data.filterAuctionPhaseCount[0].completed || 0;
				$scope.typ.otwarte.count = data.auctionTypeCount[0].open || 0;
				$scope.typ.zamkniete.count = data.auctionTypeCount[0].closed || 0;
				$scope.my.zoferta.count = data.wybranaOferta || 0;
				
				$scope.offers = data.auctionList.list;
console.log(data);
				$ionicLoading.hide();
			},
			function(err) {
				$location.path('/login');
				$ionicLoading.hide();
			}
		);
	};
	
	if($stateParams.t) {
			if($stateParams.t == 't') { $scope.termin.choice = '1' }
			if($stateParams.t == 'w') { $scope.my.choice = '1' }			
		}
	$scope.refresh();
})

.controller('OfferCtrl', function($scope, $stateParams, Auctions,$ionicLoading) {
	$scope.model = {};
		$ionicLoading.show({
			showBackdrop: true
		});
		Auctions.offer($stateParams.offerId).then(
			function(data) {
				$scope.model = data;
				console.log($scope.model);
				$ionicLoading.hide();
			},
			function(err) {
				//console.log(err);
				$location.path('/login');
				$ionicLoading.hide();
			}
		);
	
})
/*** NEW OFFER ***/
.controller('NewOfferCtrl', function($scope, $stateParams, Auctions,$ionicLoading,$ionicPopup,$location) {
	$scope.model = {};
	var aid = $stateParams.auctionId;
	_this = this;
	_this.aid = $stateParams.auctionId;
	$scope.send = function() {
		$ionicLoading.show({
			showBackdrop: true
		});
		Auctions.newoffer($stateParams.auctionId,$scope.model.value).then(
			function(result) {
				//console.log(result);
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					title: 'Sukces!',
					template: 'Złozyłeś ofertę'
				});
				alertPopup.then(function(res) {
				console.log(aid);
					//$location.path('/app/auction/'aid);
					$location.path('/app/allauctions');
					//console.log('Thank you for not eating my delicious ice cream cone');
				});
				
			},
			function(err) {
				console.log(err);
				$scope.message = err.message;
				$ionicLoading.hide();
			}
		);
	};
})
/*** LOGIN ***/
.controller('LoginCtrl', function($scope, AuthenticationService, $location, $ionicLoading) {
	$scope.$on('$ionicView.beforeEnter', function(){
		AuthenticationService.ClearCredentials();
	});	
	$scope.message = "";

	$scope.user = {
		username: '',//"kajtekp@op.pl",
		password: ''//"test"
	};

	$scope.login = function() {
		$ionicLoading.show({
			showBackdrop: true
		});
		
		AuthenticationService.Login($scope.user.username, $scope.user.password)
			.then(function(result) {
				response = result;				
				if(response.success) {					
					AuthenticationService.SetCredentials(response.username, response.token);
					$ionicLoading.hide();
					$scope.user = {};
					$scope.message = "";
					$location.path('/app/default');
				} else {
					$scope.message = response.message;
					$ionicLoading.hide();
				}
			}, function(err) {
				$scope.message = err.message;
				$ionicLoading.hide();
			});
	};
})
;