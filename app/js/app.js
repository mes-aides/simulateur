'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ddsCommon', 'ngSanitize']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
    moment.lang('fr');

    var CURRENT_YEAR_TWO_DIGITS = (new Date()).getFullYear() - 2000;
    moment.parseTwoDigitYear = function(input) {  // see https://github.com/moment/moment/issues/2219
        input = parseInt(input);
        return input + (input <= CURRENT_YEAR_TWO_DIGITS ? 2000 : 1900);
    };

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $uiViewScrollProvider.useAnchorScroll();

    var individuFormView = function(individuRole) {
        return {
            templateUrl: '/partials/foyer/individu-form.html',
            controller: 'FoyerIndividuFormCtrl',
            resolve: {
                individuRole: function() {
                    return individuRole;
                }
            }
        };
    };

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/partials/homepage.html',
            controller: 'HomepageCtrl',
            preventFocus: true
        })
        .state('a_propos', {
            url: '/a-propos',
            templateUrl: '/partials/a-propos.html',
            data: {
                pageTitle: 'A propos - '
            }
        })
        .state('cgu', {
            url: '/conditions-generales-d-utilisation',
            templateUrl: '/partials/cgu.html',
            data: {
                pageTitle: 'Conditions générales d\'utilisation - '
            }
        })
        .state('contribuez', {
            url: '/contribuez',
            templateUrl: '/partials/contribuez.html',
            controller: 'ContribuezCtrl',
            data: {
                pageTitle: 'Contribuez ! - '
            }
        })
        .state('faq', {
            url: '/faq',
            templateUrl: '/partials/faq.html',
            data: {
                pageTitle: 'FAQ - '
            }
        })
        .state('communication', {
            url: '/communication',
            templateUrl: '/partials/communication.html',
            data: {
                pageTitle: 'Communication - '
            }
        })
        .state('tests', {
            url: '/tests',
            onEnter: function($window) {
                $window.location.href = '/tests';
            }
        })
        .state('foyer', {
            abstract: true,
            url: '/foyer',
            views: {
                '': {
                    controller: 'FoyerCtrl',
                    templateUrl: '/partials/foyer/layout.html',
                },
                'recap_situation@foyer': {
                    controller: 'RecapSituationCtrl',
                    templateUrl: '/partials/foyer/recap-situation.html'
                }
            },
            data: {
                pageTitle: 'Simulation - '
            }
        })
        .state('foyer.demandeur', {
            url: '/demandeur',
            views: {
                '': {
                    templateUrl: '/partials/foyer/demandeur.html'
                },
                'individuForm@foyer.demandeur': individuFormView('demandeur')
            },
            preventFocus: true
        })
        .state('foyer.conjoint', {
            url: '/conjoint',
            views: {
                '': {
                    templateUrl: '/partials/foyer/conjoint.html',
                    controller: 'FoyerConjointCtrl',
                },
                'individuForm@foyer.conjoint': individuFormView('conjoint')
            }
        })
        .state('foyer.enfants', {
            url: '/enfants',
            views: {
                '': {
                    templateUrl: '/partials/foyer/enfants.html',
                    controller: 'FoyerEnfantsCtrl'
                },
                'enfantForm@foyer.enfants': individuFormView('enfant'),
            }
        })
        .state('foyer.logement', {
            url: '/logement',
            templateUrl: '/partials/foyer/logement.html',
            controller: 'FoyerLogementCtrl'
        })
        .state('foyer.ressources', {
            url: '/ressources',
            controller: 'FoyerRessourcesCtrl',
            templateUrl: '/partials/foyer/ressources/layout.html'
        })
        .state('foyer.ressources.types', {
            templateUrl: '/partials/foyer/ressources/types.html',
            controller: 'FoyerRessourceTypesCtrl',
            url: '/:individu/types'
        })
        .state('foyer.pensionsAlimentaires', {
            templateUrl: '/partials/foyer/pensions-alimentaires.html',
            controller: 'FoyerPensionsAlimentairesCtrl',
            url: '/ressources/pensions-alimentaires'
        })
        .state('foyer.resultat', {
            url: '/resultat',
            templateUrl: '/partials/resultat.html',
            controller: 'ResultatCtrl'
        })
        .state('foyer.ressourcesYearMoins2', {
            templateUrl: '/partials/foyer/ressources/year-moins-2.html',
            controller: 'FoyerRessourceYearMoins2Ctrl',
            url: '/ressources/revenus-impots'
        })
        .state('foyer.rfr', {
            templateUrl: '/partials/foyer/ressources/rfr.html',
            controller: 'FoyerRessourceRfrCtrl',
            url: '/ressources/rfr'
        })
        .state('foyer.patrimoine', {
            url: '/patrimoine',
            templateUrl: '/partials/foyer/patrimoine.html',
            controller: 'FoyerPatrimoineCtrl'
        })
        .state('foyer.download_cerfa', {
            url: '/telecharger-formulaires/:droit',
            templateUrl: '/partials/download-cerfa.html',
            controller: 'DownloadCerfaCtrl',
            resolve: {
                situation: function(SituationService) {
                    return SituationService.restoreLocal();
                },
                droit: function($stateParams) {
                    return $stateParams.droit;
                }
            },
            data: {
                pageTitle: 'Téléchargement formulaires - '
            }
        })
        .state('situation', {
            url: '/situations/:situationId',
            template: '',
            controller: function(SituationService, $state, $stateParams) {
                SituationService.restoreRemote($stateParams.situationId).then(function() {
                    $state.go('foyer.resultat', { situationId: $stateParams.situationId });
                });
            }
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, $modalStack, $anchorScroll, $timeout, ImpactStudyService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // Offset de l'anchorscroll à 60px, nécessaire à cause de la navbar en position fixed
    $anchorScroll.yOffset = 60;

    // changement d'url vers /api => débranchement de ui-router
    $rootScope.$on('$locationChangeStart', function(e, location) {
        if (0 === location.indexOf($window.location.origin + '/api')) {
            e.preventDefault();
            $window.location.href = location;
        }
    });

    // fermeture d'une éventuelle modale rémanente au changement d'état (suite à des bugs récurrents)
    $rootScope.$on('$stateChangeStart', function() {
        var top = $modalStack.getTop();
        if (top) {
            $modalStack.dismiss(top.key);
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, current) {
        // Default - set page focus to first h1
        if (! current.preventFocus) {
            // $timeout adds the function to the next angular digest cycle,
            // waiting for the page to load before executing it
            $timeout(function() {
                var title = document.querySelector('h1');
                // If anyone wants to set a tabindex manually, do not overwrite it
                if (title && title.tabIndex < 0) {
                    title.tabIndex = -1;
                    title.focus();
                }
            }, 0);
        }
    });

    $rootScope.$on('$locationChangeSuccess', function(event, current) {
        if ($window._paq) {
            $window._paq.push(['setCustomUrl', current]);
            $window._paq.push(['trackPageView']);
        }

        ImpactStudyService.sendVisitedPage();
    });
});
