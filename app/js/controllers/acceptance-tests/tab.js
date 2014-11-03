'use strict';

angular.module('acceptanceTests').controller('TabCtrl', function($scope, $http, $q, $window, $state, $stateParams, $location, droitsDescription, acceptanceTests, AcceptanceTestsService) {
    $scope.$emit('stopWaiting');

    if ($stateParams.testId) {
        $location.hash('test-' + $stateParams.testId);
        var testToScroll = _.find(acceptanceTests, {'_id': $stateParams.testId});
        if (testToScroll) {
            testToScroll.open = true;
        }
    }

    $scope.tests = acceptanceTests;
    $scope.categories = AcceptanceTestsService.categorizeTests(acceptanceTests);
    $scope.droits = _.indexBy(droitsDescription, 'id');
    $scope.pendingTests = 0;

    $scope.displayDroitValue = function(value) {
        if (_.isBoolean(value)) {
            return value ? 'Oui' : 'Non';
        }

        if (_.isNumber(value)) {
            return '' + value + ' €';
        }

        return '';
    };

    $scope.newLineToBr = function(text) {
        text = text
                .replace(/&/g, '&amp;')
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;');

        return text.replace(/\n/g, '<br>');
    };

    $scope.launchSingle = function(test) {
        delete test.status;
        test.running = true;
        test.droitsAttendus.forEach(function(droit) {
            delete droit.status;
            delete droit.actualValue;
        });

        return AcceptanceTestsService.launchTest(test);
    };

    $scope.launchAll = function() {
        $scope.pendingTests = $scope.tests.length;
        $scope.errors = 0;
        $scope.categories.forEach(function(category) {
            category.errors = 0;
            category.tests.forEach(function(test) {
                $scope.launchSingle(test)
                    .catch(function() {
                        $scope.errors++;
                        category.errors++;
                    }).finally(function() {
                        $scope.pendingTests--;
                    });
            });
        });
    };

    $scope.validTest = function(idxCategory, category, idxTest, test) {
        $http.put('/api/acceptance-tests/' + test._id + '/validation').then(function() {
            if ($state.is('index.invalidated')) {
                category.tests.splice(idxTest, 1);
                if (category.tests.length === 0) {
                    $scope.categories.splice(idxCategory, 1);
                }
            }
            test.validated = true;
        });
    };

    $scope.invalidTest = function(idxCategory, category, idxTest, test) {
        $http.delete('/api/acceptance-tests/' + test._id + '/validation').then(function() {
            if ($state.is('index.validated')) {
                category.tests.splice(idxTest, 1);
                if (category.tests.length === 0) {
                    $scope.categories.splice(idxCategory, 1);
                }
            }
            test.validated = false;
        });
    };

    $scope.showErrors = function() {
        return angular.isDefined($scope.errors);
    };

    $scope.deleteTest = function(test) {
        if ($window.confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
            $http.delete('/api/acceptance-tests/' + test._id).then(function() {
                $state.go($state.current, {}, {reload: true});
            });
        }
    };

    $scope.toggleSituation = function(test) {
        if (!test.situationObject) {
            $http.get('/api/situations/' + test.situation).then(function(result) {
                test.situationObject = result.data;
            });
        }
        test.showSituation = !test.showSituation;
    };
});