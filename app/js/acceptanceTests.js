'use strict';

var ddsApp = angular.module('acceptanceTests', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ngSanitize', 'ddsCommon']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            controller: 'IndexCtrl',
            templateUrl: '/acceptance-tests/partials/index.html'
        })
        .state('index.all', {
            url: '/?testId',
            controller: 'TabCtrl',
            templateUrl: '/acceptance-tests/partials/tab.html',
            resolve: {
                acceptanceTests: ['AcceptanceTestsService', function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getAndHandleLastResult('');
                }]
            }
        })
        .state('index.validated', {
            url: '/valides',
            controller: 'TabCtrl',
            templateUrl: '/acceptance-tests/partials/tab.html',
            resolve: {
                acceptanceTests: ['AcceptanceTestsService', function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getAndHandleLastResult('validated');
                }]
            }
        })
        .state('index.invalidated', {
            url: '/non-valides',
            controller: 'TabCtrl',
            templateUrl: '/acceptance-tests/partials/tab.html',
            resolve: {
                acceptanceTests: ['AcceptanceTestsService', function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getAndHandleLastResult('rejected');
                }]
            }
        })
        .state('index.waiting', {
            url: '/en-attente',
            controller: 'TabCtrl',
            templateUrl: '/acceptance-tests/partials/tab.html',
            resolve: {
                acceptanceTests: ['AcceptanceTestsService', function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getAndHandleLastResult('pending');
                }]
            }
        })
        .state('index.mine', {
            url: '/mes-tests',
            controller: 'TabCtrl',
            templateUrl: '/acceptance-tests/partials/tab.html',
            resolve: {
                acceptanceTests: ['$http', function($http) {
                    return $http.get('/api/acceptance-tests/mine').then(function(result) {
                        return result.data;
                    });
                }]
            }
        })
        .state('login', {
            url: '/login?targetUrl',
            templateUrl: '/acceptance-tests/partials/login.html',
            controller: 'LoginCtrl',
            anonymous: true
        })
        .state('new', {
            url: '/new/:situationId',
            templateUrl: '/acceptance-tests/partials/form.html',
            controller: 'FormCtrl',
            resolve: {
                droitsObtenus: ['$http', '$stateParams', function($http, $stateParams) {
                    return $http.get('/api/situations/' + $stateParams.situationId + '/simulation').then(function(result) {
                        return result.data;
                    });
                }],
                test: function() {
                    return null;
                }
            }
        })
        .state('edit', {
            url: '/:testId/edit',
            templateUrl: '/acceptance-tests/partials/form.html',
            controller: 'FormCtrl',
            resolve: {
                droitsObtenus: function() {
                    return null;
                },
                test: ['$http', '$stateParams', function($http, $stateParams) {
                    return $http.get('/api/acceptance-tests/' + $stateParams.testId).then(function(result) {
                        return result.data;
                    });
                }]
            }
        })
        .state('users', {
            url: '/users',
            templateUrl: '/acceptance-tests/partials/users.html',
            controller: 'UsersCtrl',
            resolve: {
                users: ['$http', function($http) {
                    return $http.get('/api/users').then(function(result) {
                        return result.data;
                    });
                }]
            }
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, UserService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    UserService.retrieveUserAsync()
        .catch(function() {
            $state.go('login', {targetUrl: $window.location.pathname});
        })
        .finally(function() {
            $rootScope.$on('$stateChangeStart', function(e, state) {
                if (!UserService.user() && !state.anonymous) {
                    e.preventDefault();
                    $state.go('login');
                }
            });
            $rootScope.appReady = true;
        });
});
