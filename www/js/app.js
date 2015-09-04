angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.constant('ApiEndpoint', {
	url: 'http://mark-et.pl/pl/api/'
	//url: 'http://localhost/app_dev.php/pl/api/'
})

.run(function($rootScope, $location, $ionicPlatform,$localstorage) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		
		$rootScope.globals = $localstorage.getObject('globals') || {};
		if(!$rootScope.globals.currentUser) {
			$location.path('/login');
		} else {
			$location.path('/app/default');
		}
	});
	
	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		$rootScope.globals = $localstorage.getObject('globals') || {};
		if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
			$location.path('/login');
		}
	});
})

.config(function($stateProvider, $urlRouterProvider,$interpolateProvider) {
	//$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
	
	$stateProvider.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'AppCtrl'
	}).state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginCtrl'
	}).state('app.default', {
		cache: false,
		url: "/default",
		views: {
			'menuContent': {
				templateUrl: "templates/default.html",
				controller: 'AppCtrl'
			}
		}
	})
	.state('app.allauctions', {
		url: "/allauctions",
		views: {
			'menuContent': {
				templateUrl: "templates/auctions.html",
				controller: 'AllAuctionsCtrl'
			}
		}
	})
	.state('app.auctions', {
		url: "/auctions",
		views: {
			'menuContent': {
				templateUrl: "templates/auctions.html",
				controller: 'AuctionsCtrl'
			}
		}
	}).state('app.auctions-finished', {
		url: "/auctions/:t",
		views: {
			'menuContent': {
				templateUrl: "templates/auctions.html",
				controller: 'AuctionsCtrl'
			}
		}
	}).state('app.auctions-continue', {
		url: "/auctions/:t",
		views: {
			'menuContent': {
				templateUrl: "templates/auctions.html",
				controller: 'AuctionsCtrl'
			}
		}
	}).state('app.auction', {
		url: "/auction/:auctionId",
		views: {
			'menuContent': {
				templateUrl: "templates/auction.html",
				controller: 'AuctionCtrl'
			}
		}
	}).state('app.offers', {
		url: "/offers",
		views: {
			'menuContent': {
				templateUrl: "templates/offers.html",
				controller: 'OffersCtrl'
			}
		}
	}).state('app.offers-continue', {
		url: "/offers/:t",
		views: {
			'menuContent': {
				templateUrl: "templates/offers.html",
				controller: 'OffersCtrl'
			}
		}
	}).state('app.offers-wybrane', {
		url: "/offers/:t",
		views: {
			'menuContent': {
				templateUrl: "templates/offers.html",
				controller: 'OffersCtrl'
			}
		}
	}).state('app.offer', {
		url: "/offer/:offerId",
		views: {
			'menuContent': {
				templateUrl: "templates/offer.html",
				controller: 'OfferCtrl'
			}
		}
	}).state('app.newoffer', {
		url: "/newoffer/:auctionId",
		views: {
			'menuContent': {
				templateUrl: "templates/new.html",
				controller: 'NewOfferCtrl'
			}
		}
	});
	$urlRouterProvider.otherwise('/login');
}).factory('$localstorage', ['$window', function($window) {
	random='SDFAgdfgdgf_';
	return {
		set: function(key, value) {
			$window.localStorage[random+key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[random+key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[random+key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage[random+key] || '{}');
		}
	}
}]);