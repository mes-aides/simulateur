'use strict';

angular.module('ddsCommon').factory('AcceptanceTestsService', function($q, $http) {
    return {
        getAndHandleLastResult: function(state) {
            var self = this;
            return $http.get('/api/acceptance-tests/' + state).then(function(result) {
                var tests = result.data;
                _.map(tests, function(test) {
                    if (test.derniereExecution) {
                        self.handleResult({data: test.derniereExecution}, test);
                    }
                });
                return tests;
            });
        },

        handleResult: function(result, test, deferred) {
            var droits = _.indexBy(result.data.droitsCalcules, 'code');
            test.status = 'ok';
            test.droitsAttendus.forEach(function(droit) {
                var actualValue = droits[droit.code];
                if (angular.isDefined(actualValue)) {
                    delete droits[droit.code];
                    droit.actualValue = actualValue.value;
                    if (_.isUndefined(droit.value)) {
                        droit.status = 'unknown';
                    } else if (droit.actualValue === droit.value) {
                        droit.status = 'ok';
                    } else if ((Math.abs(droit.actualValue - droit.value) / droit.value) < 0.02) {
                        droit.status = 'ok';
                    } else if ((Math.abs(droit.actualValue - droit.value) / droit.value) < 0.1) {
                        droit.status = 'near';
                        if (test.status !== 'ko') {
                            test.status = 'near';
                        }
                    } else {
                        droit.status = 'ko';
                        test.status = 'ko';
                    }
                }
            });

            _.forEach(droits, function(droit, id) {
                if (droit.value) {
                    test.droitsAttendus.push({
                        code: id,
                        value: undefined,
                        actualValue: droit.value,
                        status: 'unknown'
                    });
                }
            });

            _.where(test.droitsAttendus, { status: undefined }).forEach(function(droit) {
                droit.status = 'ko';
                test.status = 'ko';
                droit.actualValue = false;
            });

            if (deferred) {
                if (test.status === 'ko') {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
            }
        },

        categorizeTests: function(tests) {
            var categories = [];
            var categoriesMap = {};
            var unknownCategory = { name: 'Non catégorisés', tests: [] };
            tests.forEach(function(test) {
                if (test._updated) {
                    var updatedAt = moment(test._updated);
                    test.updatedAt = updatedAt.format('DD/MM/YYYY') + ' à ' + updatedAt.format('HH:mm');
                }
                if (test._created) {
                    var createdAt = moment(test._created);
                    test.createdAt = createdAt.format('DD/MM/YYYY') + ' à ' + createdAt.format('HH:mm');
                }
                var index = test.name.indexOf(']');
                if (-1 !== index) {
                    var categoryName = test.name.substring(1, index);
                    test.name = test.name.substring(index + 2, test.name.length);
                    var category = categoriesMap[categoryName];
                    if (!category) {
                        category = categoriesMap[categoryName] = {name: categoryName, tests: []};
                        categories.push(category);
                    }
                    category.tests.push(test);
                } else {
                    unknownCategory.tests.push(test);
                }
            });

            if (unknownCategory.tests.length) {
                categories.push(unknownCategory);
            }

            categories.forEach(function(category) {
                category.tests = _.sortBy(category.tests, 'name');
            });

            return categories;
        },

        launchTest: function(test) {
            var self = this;
            delete test.status;
            test.droitsAttendus.forEach(function(droit) {
                delete droit.status;
                delete droit.actualValue;
            });

            var deferred = $q.defer();

            var promise = $http.post('/api/acceptance-tests/' + test._id + '/executions', {});
            promise.then(function(result) {
                return self.handleResult(result, test, deferred);
            }, function() {
                test.status = 'ko';
                test.droitsAttendus.forEach(function(droit) {
                    droit.status = 'ko';
                });
                deferred.reject();
            });

            deferred.promise.finally(function() {
                test.running = false;
            });

            return deferred.promise;
        }
    };
});
