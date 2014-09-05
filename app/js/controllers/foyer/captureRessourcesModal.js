'use strict';

angular.module('ddsApp').controller('FoyerCaptureRessourcesModalCtrl', function($scope, $rootScope, $modalInstance, individus, SituationService, ressourceTypes) {
    $scope.ressourceTypes = ressourceTypes;

    $scope.months = SituationService.getMonths();
    var lastMonth = moment().subtract('months', 1).startOf('month');
    $scope.lastMonth = lastMonth.format('MMMM YYYY');
    var lastYear = moment().subtract('years', 1);
    $scope.lastYear = lastYear.format('MMMM YYYY');
    $scope.selectedRessources = {};

    $scope.individuRefs = _.map(individus, function(individu) {
        return {
            label: SituationService.individuLabel(individu),
            selectedRessources: {},
            ressources: [],
            individu: individu
        };
    });

    $scope.previousStep = function() {
        if ($scope.personnesSelected) {
            $scope.personnesSelected = false;
            if (1 === $scope.individuRefs.length) {
                $scope.ressourcesSelected = false;
            }
        } else {
            $scope.ressourcesSelected = false;
        }
    };

    $scope.submit = function() {
        var closeModal = true;
        if (!$scope.ressourcesSelected) {
            $scope.ressourcesSelected = true;
            closeModal = !_.filter($scope.selectedRessources).length;
            // cas particulier si le demandeur est seul : on bypass l'écran intermédiaire de sélection des personnes
            if (1 === $scope.individuRefs.length) {
                $scope.individuRefs[0].selectedRessources = $scope.selectedRessources;
                $scope.personnesSelected = true;
                $scope.initIndividusRessources();
            }
        } else if (!$scope.personnesSelected) {
            $scope.personnesSelected = true;
            $scope.initIndividusRessources();
            closeModal = !$scope.hasRessources();
        }

        if (closeModal) {
            $scope.applyIndividuRefsRessourcesToIndividus();
            $rootScope.$broadcast('ressourcesCaptured');
            $modalInstance.close();
        }
    };

    $scope.hasIndividuRessources = function(individuRef) {
        var selectedRessources = _.filter(individuRef.selectedRessources);
        return !!_.values(selectedRessources).length;
    };

    $scope.hasRessources = function() {
        var result = false;
        $scope.individuRefs.forEach(function(individuRef) {
            result = result || $scope.hasIndividuRessources(individuRef);
        });

        return result;
    };

    $scope.initIndividusRessources = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            _.forEach(individuRef.selectedRessources, function(selected, type) {
                if (!$scope.selectedRessources[type]) {
                    individuRef.selectedRessources[type] = false;
                }
            });

            individuRef.ressources = _.filter(individuRef.ressources, function(ressource) {
                return !!individuRef.selectedRessources[ressource.type.id];
            });

            var previousRessources = individuRef.ressources;
            individuRef.ressources = [];
            $scope.ressourceTypes.forEach(function(ressourceType) {
                if (individuRef.selectedRessources[ressourceType.id]) {
                    var ressource = _.find(previousRessources, {type: ressourceType});
                    if (!ressource) {
                        ressource = {
                            type: ressourceType,
                            months: [
                                { periode: $scope.months[0].id, montant: 0 },
                                { periode: $scope.months[1].id, montant: 0 },
                                { periode: $scope.months[2].id, montant: 0 }
                            ],
                            year: {
                                montant: 0
                            }
                        };
                    }
                    individuRef.ressources.push(ressource);
                }
            });
        });
    };

    $scope.updateYearAmount = function(ressource) {
        var montants = _.map(ressource.months, function(month) {
            return month.montant;
        });
        ressource.year.montant = Math.round(4 * _.reduce(montants, function(sum, num) {
            return sum + num;
        }));
    };

    $scope.filterSelectedRessourceTypes = function(ressourceType) {
        return !!$scope.selectedRessources[ressourceType.id];
    };

    $scope.applyIndividuRefsRessourcesToIndividus = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            var individu = individuRef.individu;
            individu.ressources = [];
            individuRef.ressources.forEach(function(ressource) {
                ressource.months.forEach(function(month) {
                    individu.ressources.push({
                        periode: month.periode,
                        type: ressource.type.id,
                        montant: month.montant
                    });
                });
                individu.ressources.push({
                    debutPeriode: lastYear.format('YYYY-MM'),
                    finPeriode: lastMonth.format('YYYY-MM'),
                    type: ressource.type.id,
                    montant: ressource.year.montant
                });
            });
        });
    };
});