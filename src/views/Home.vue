<template>
    <div id="homepage">
        <div class="container">
            <main class="hero">
                <div class="hero__container text-center">
                    <h1>
                        Evaluez votre pouvoir d'achat si vos revenus changent
                    </h1>

                    <WordSlider />

                    <div>
                        <a
                            v-bind:class="`button ${ctaSize} primary`"
                            v-on:click="newSituation()"
                        >
                            {{ ctaLabel }}
                        </a>
                        <a
                            v-bind:class="`button ${ctaSize} secondary`"
                            v-on:click="next()"
                            v-if="hasExistingSituation"
                        >
                            Reprendre la simulation
                        </a>
                    </div>
                </div>
            </main>
            <p>
                Ce simulateur s'appuie sur
                {{ prestationsNationalesCount }} aides nationales et
                {{ partenairesLocauxCount }} aides locales.
                <small
                    ><router-link to="/toutes"
                        >Accéder à la liste</router-link
                    ></small
                >
            </p>
        </div>
    </div>
</template>

<script>
import Institution from "../lib/Institution";
import _ from "lodash";
import WordSlider from "@/components/WordSlider";

export default {
    name: "home",
    components: {
        WordSlider
    },
    data: () => {
        let value = {};
        const types = ["prestationsNationales", "partenairesLocaux"];
        types.forEach(function(type) {
            let providersWithoutPrivatePrestations = _.mapValues(
                Institution[type],
                function(provider) {
                    provider = _.assign({}, provider);
                    provider.prestations = _.reduce(
                        provider.prestations,
                        function(prestations, prestation, name) {
                            if (!prestation.private) {
                                prestations[name] = prestation;
                            }

                            return prestations;
                        },
                        {}
                    );
                    return provider;
                }
            );

            value[type] = _.filter(providersWithoutPrivatePrestations, function(
                provider
            ) {
                return _.size(provider.prestations);
            });
            value[type + "Count"] = Object.keys(value[type]).reduce(function(
                total,
                provider
            ) {
                return total + _.size(value[type][provider].prestations);
            },
            0);
        });

        return value;
    },
    computed: {
        hasExistingSituation: function() {
            return this.$store.getters.passSanityCheck;
        },
        ctaLabel: function() {
            return this.hasExistingSituation
                ? "Commencer une nouvelle simulation"
                : "Évaluer mes droits";
        },
        ctaSize: function() {
            return this.hasExistingSituation ? "large" : "xlarge";
        }
    },
    methods: {
        newSituation: function() {
            this.$store.dispatch("clear", this.$route.query.external_id);
            this.next();
        },
        next: function() {
            this.$push();
        }
    }
};
</script>

<style scoped lang="scss">
.xlarge,
.xlarge:active {
    font-size: 2em;
    line-height: 1em;
}

#app {
    height: 100%;
}

.cta {
    display: flex;
    justify-content: space-around;
    align-items: stretch;
}

.hero {
    background-color: #fffa;
}

.hero__container {
    min-height: 55vh;
}

hr {
    border-top: 1px solid #ddd;
}

#homepage {
    background-attachment: fixed;
    background-position: top center;
    background-size: 100%;
    background-repeat: no-repeat;
}

.panel {
    border-color: #d45500;
}
</style>
