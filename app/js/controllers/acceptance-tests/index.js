'use strict';

angular.module('acceptanceTests').controller('IndexCtrl', function($scope, $state, $http) {
    $scope.tabs = [
        { heading: 'Tous', route:'index.all', active:false },
        { heading: 'Validés', route:'index.validated', active:false },
        { heading: 'Non validés', route:'index.invalidated', active:false },
        { heading: 'Mes tests', route:'index.mine', active:false }
    ];

    $scope.setWaiting = function(tab) {
        if (!$scope.active(tab.route)) {
            tab.waiting = true;
        }
    };

    $scope.active = function(route) {
        return $state.is(route);
    };

    $scope.$on('stopWaiting', function() {
        $scope.tabs.forEach(function(tab) {
            tab.waiting = false;
        });
    });

    $scope.$on('$stateChangeSuccess', function() {
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });

    $scope.gotoDebugOpenFisca = function(situation) {
        $http.get('/api/situations/' + situation + '/openfisca-request').then(function(result) {
            var url = 'http://www.openfisca.fr/outils/trace?api_url=http://localhost:2000&situation=';
            url += encodeURIComponent(JSON.stringify(result.data));
            window.location.href = url;
        });
    };
});
