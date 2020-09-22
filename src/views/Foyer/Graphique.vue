<template>
    <div class="container">
        <p v-show="accessStatus.fetching">
            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
            Récupération de la situation en cours…
        </p>
        <p v-show="resultatStatus.updating">
            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Calcul en
            cours de vos droits…
        </p>

        <div class="alert alert-warning" v-if="hasWarning">
            <div>
                <h2>
                    <i class="fa fa-warning" aria-hidden="true"></i> Aucun
                    résultat disponible
                </h2>
                <h3>
                    La simulation à laquelle vous souhaitez accéder n‘est pas
                    accessible.
                </h3>
                <p>
                    Pour commencer votre simulation, rendez-vous sur la
                    <router-link to="home">page d'accueil</router-link>.
                </p>
            </div>
        </div>

        <div id="error" class="alert alert-danger" v-if="hasError" role="alert">
            <h2>
                <i class="fa fa-warning" aria-hidden="true"></i> Une erreur est
                survenue.
            </h2>
            <p>
                <a
                    v-mail="{
                        to: 'equipe@mes-aides.org',
                        subject: `[${resultatsId}] Problème technique`,
                        body: `Bonjour,

    J'ai tenté de XXX,
    Et en cliquant sur XXX,
    J'ai rencontré l'erreur ci-dessous.

    Je vous joins également une capture d'écran pour faciliter la compréhension du problème.

    ————
    ID : ${resultatsId}
    User-agent : ${userAgent}
    Erreur : ${error}
    ————`
                    }"
                    >Signalez ce problème</a
                >
                en décrivant ce que vous faisiez avant que cette erreur
                n'apparaisse, et en joignant si possible une capture d'écran.
                Nous vous répondrons au plus vite et corrigerons le problème dès
                que possible.
            </p>

            <p>
                Pour ne pas perdre les données que vous avez déclarées, vous
                pouvez garder cet onglet ouvert, puis actualiser la page une
                fois que le problème sera résolu.
            </p>

            <small>
                Informations techniques :
                <pre v-html="error"></pre>
            </small>
        </div>

        <div v-if="datacollection">


            <p>
                Nous avons réalisé {{ datacollection.labels.length }} simulations autour de votre salaires. Cela donne donc des résultats pour un salaire mensuel net allant de <strong>{{ datacollection.labels[0] }}€ / mois</strong> à <strong>{{ datacollection.labels[datacollection.labels.length - 1] }}€ / mois</strong>.
            </p>

            <bar-chart
                v-if="datacollection"
                :chartdata="datacollection"
                :options="chartOptions"
            ></bar-chart>

            <div
                class="alert alert-warning print-hidden"
                v-if="!ressourcesYearMinusTwoCaptured"
            >
                <span>
                    <h2 v-if="droits && !droits.length">
                        Votre simulation n'a pas permis de découvrir de nouveaux
                        droits.
                    </h2>
                    <i
                        class="fa fa-warning text-warning"
                        aria-hidden="true"
                    ></i>

                    Nous avons supposé que vos ressources pour l’année
                    {{ $store.state.dates.fiscalYear.label }} étaient les mêmes
                    qu’entre {{ $store.state.dates.twelveMonthsAgo.label }} et
                    {{ $store.state.dates.oneMonthAgo.label }}.
                </span>

                <router-link
                    class="button-outline warning text-center"
                    to="ressources/fiscales"
                    >Déclarez vos ressources
                    {{ $store.state.dates.fiscalYear.label }}</router-link
                >
            </div>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import DroitsList from "./../../components/DroitsList";
import LineChart from "./../../components/Charts/Line";
import BarChart from "./../../components/Charts/Bar";
import axios from "axios";

export default {
    name: "resultat",
    data: function() {
        return {
            openfiscaTracerURL: false,
            openfiscaAxeURL: false,
            showExpertLinks: false,
            showPrivate: false,
            datacollection: null,
            chartOptions: {
                // height: '400px',
                // position: 'relative',
                // responsive: false,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }

        };
    },
    components: {
        DroitsList,
        LineChart,
        BarChart,
    },
    computed: {
        droits: function() {
            return this.resultats && this.resultats.droitsEligibles;
        },
        droitsInjectes: function() {
            return (this.resultats && this.resultats.droitsInjectes) || [];
        },
        droitsNonEligibles: function() {
            return (
                (this.droitsNonEligiblesShow &&
                    this.resultats &&
                    this.resultats.droitsNonEligibles) ||
                []
            );
        },
        droitsNonEligiblesShown: function() {
            return this.droitsNonEligibles.filter(
                i => i.id === "css_participation_forfaitaire"
            );
        },
        droitsNonEligiblesShow: function() {
            return this.$store.state.ameliNoticationDone;
        },
        resultatsId: function() {
            return (this.resultats && this.resultats._id) || "???";
        },
        accessStatus: function() {
            return this.$store.state.access;
        },
        resultatStatus: function() {
            return this.$store.state.calculs;
        },
        resultats: function() {
            return this.$store.state.calculs.resultats;
        },
        ressourcesYearMinusTwoCaptured: function() {
            return this.$store.getters.ressourcesYearMinusTwoCaptured;
        },
        situation: function() {
            return this.$store.state.situation;
        },
        shouldPatrimoineBeCaptured: function() {
            if (!this.droits) {
                return;
            }

            return (
                _.some(this.droits, "isBaseRessourcesPatrimoine") &&
                this.$store.getters.hasPatrimoine === undefined
            );
        },
        hasWarning: function() {
            return this.accessStatus.forbidden;
        },
        hasError: function() {
            return this.resultatStatus.error;
        },
        shouldDisplayResults: function() {
            return Boolean(datacollection);
        },
        error: function() {
            let value =
                this.resultatStatus.error && this.resultatStatus.exception;
            return _.isString(value) || value instanceof Error
                ? value
                : JSON.stringify(value, null, 2);
        },
        userAgent: function() {
            return window.navigator.userAgent;
        }
    },
    methods: {
        goToFeedback: function(event) {
            this.$ScrollService.go(event, document.getElementById("feedback"));
        },
        isEmpty: function(array) {
            return !array || array.length === 0;
        },
        isNotEmpty: function(array) {
            return array && array.length !== 0;
        },
        toggleLinks: function() {
            if (!this.openfiscaTracerURL) {
                this.$store.getters
                    .fetchRepresentation("openfisca_tracer")
                    .then(representation => {
                        this.openfiscaTracerURL =
                            representation.destination.url;
                    });

                this.$store.getters
                    .fetchRepresentation("openfisca_axe")
                    .then(representation => {
                        this.openfiscaAxeURL = representation.destination.url;
                    });
            }
            this.showExpertLinks = !this.showExpertLinks;
        },
        togglePrivate: function() {
            this.showPrivate = !this.showPrivate;
            this.$store.dispatch("compute", this.showPrivate);
        },
        fillData: function() {
            axios
                .get(
                    `api/situations/${this.$store.state.situation._id}/get-simulations-data`
                )
                .then(response => {
                    this.datacollection = response.data;
                });
        }
    },
    mounted: function() {
        this.fillData();

        if (this.$route.query && this.$route.query.situationId) {
            if (
                this.$store.state.situation._id !==
                this.$route.query.situationId
            ) {
                this.$store
                    .dispatch("fetch", this.$route.query.situationId)
                    .then(() =>
                        this.$store.dispatch("fetchGraphique", this.showPrivate)
                    );
            } else if (!this.$store.getters.hasResults) {
                this.$store.dispatch("fetchGraphique", this.showPrivate);
            } // Else nothing to do
        } else if (!this.$store.getters.passSanityCheck) {
            return this.$store.dispatch("redirection", route =>
                this.$router.push(route)
            );
        } else {
            if (this.$store.state.calculs.dirty) {
                this.$store.dispatch("save").then(() => {
                    if (this.$store.state.access.forbidden) {
                        return;
                    }
                    return this.$store.dispatch("fetchGraphique");
                });
            } else if (!this.$store.getters.hasResults) {
                // this.$store.dispatch("fetchGraphique");
            }
        }
    }
};
</script>

<style scoped lang="scss">
h4 {
    margin-top: 0.7em;
}

.container,
.panel {
    opacity: 1;
}

.injected .droit-detail-heading {
    padding: 0;
}
.injected .droit-detail-description p {
    margin: 0;
}
</style>
