<template>
  <div id="homepage">
    <section class="my-5 py-5 text-center">
      <div class="wordslider mb-4">
        <p>Est-ce que ça vaut le coup de</p>
        <textra :data="words" :timer="3" filter="flip" :infinite="true" />
      </div>
      <bar-chart :chart-data="chartdata" :options="chartOptions"></bar-chart>
    </section>
    <section class="text-center lead">
      <h1 class="d-none">Evaluez votre pouvoir d'achat si vos revenus changent.</h1>

      <div class="my-5">
        <a class="btn btn-primary btn-lg" v-on:click="newSituation()">{{ ctaLabel }}</a>
        <a
          class="btn btn-primary btn-lg"
          v-on:click="next()"
          v-if="hasExistingSituation"
        >Reprendre la simulation</a>
      </div>
      <p>
        $PROJECT_NAME va effectuer des <strong>simulations</strong> en faisant
        évoluer vos revenus et ainsi calculer vos aides.
      </p>
      <p>
        Ce simulateur s'appuie sur
        {{ prestationsNationalesCount }} aides nationales et
        {{ partenairesLocauxCount }} aides locales.
      </p>
      <p class="text-right">
        <router-link to="/toutes" class="btn btn-link">Accéder à la liste</router-link>
      </p>
    </section>
    <hr class="my-5" />
    <section class="my-5">
      <h2>Question / réponses</h2>

      <div class="qa">
        <p class="qa__q">Comment être sûr que le calcul est correct ?</p>
        <p class="qa__a">Cette application s'appuie sur le travail de</p>
        <ul>
          <li>
            <a href="https://fr.openfisca.org/legislationhttps://openfisca.org/en/">Openfisca</a>, un moteur de calcul libre et ouvert utilisé par
            des chercheurs en économie et d’autres services
            publics.
          </li>
          <li>
            <a href="https://mes-aides.ord">mes-aides.org</a>,
            une ancienne
            <a
              href="un moteur de calcul libre et ouvert utilisé par des chercheurs en économie et d’autres services publics."
            >
              startup d’État de l’Incubateur de services
              numériques
            </a>
          </li>
        </ul>
      </div>
      <div class="qa">
        <p class="qa__q">
          Je vous donnes des informations sensibles. Qu'en est'il
          de la sécurité des données?
        </p>
        <p class="qa__a">
          Notre formulaie ne requiert aucune information
          personnelle permettant de relier votre situation à votre
          iddentité. Ainsi, aucun nom, prénom aĝe ne vous est
          demandé.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import Institution from "../lib/Institution";
import _ from "lodash";
import BarChart from "@/components/Charts/Bar";

const labels = [
  900,
  1000,
  1100,
  1200,
  1300,
  1400,
  1500,
  1600,
  1700,
  1800,
  1900,
  2000,
];

const chartdataSample = {
  labels,
  datasets: [
    {
      label: "Revenu disponible",
      backgroundColor: "green",
      data: [777, 824, 871, 918, 957, 996, 1034, 1073, 1112, 1150, 1197, 1246],
    },
    {
      label: "aides",
      backgroundColor: "orange",
      data: [332, 274, 251, 236, 206, 166, 126, 86, 46, 0, 0, 0],
    },
  ],
  barPercentage: 1,
};

export default {
  name: "home",
  components: {
    BarChart,
  },
  data: () => {
    let value = {
      words: [
        "faire du freelance à côté.",
        "faire 10 heures supplémentaire.",
        "donner des cours de piano.",
        "me mettre à mis-temps.",
      ],
      chartdata: chartdataSample,
      chartOptions: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
    };
    const types = ["prestationsNationales", "partenairesLocaux"];
    types.forEach(function (type) {
      let providersWithoutPrivatePrestations = _.mapValues(
        Institution[type],
        function (provider) {
          provider = _.assign({}, provider);
          provider.prestations = _.reduce(
            provider.prestations,
            function (prestations, prestation, name) {
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

      value[type] = _.filter(providersWithoutPrivatePrestations, function (
        provider
      ) {
        return _.size(provider.prestations);
      });
      value[type + "Count"] = Object.keys(value[type]).reduce(function (
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
    hasExistingSituation: function () {
      return this.$store.getters.passSanityCheck;
    },
    ctaLabel: function () {
      return this.hasExistingSituation
        ? "Commencer une nouvelle simulation"
        : "Évaluer mes droits";
    },
    ctaSize: function () {
      return this.hasExistingSituation ? "large" : "xlarge";
    },
  },
  methods: {
    changeDataset: function () {
      const chartdata = { ...chartdataSample };

      for (let i = 0; i < chartdata.datasets.length; i++) {
        const offset = Math.random() * 300 - 150;
        chartdata.datasets[i].data = chartdata.datasets[i].data
          .map((d) => d + offset)
          .map((d) => (d > 0 ? d : 0));
      }

      this.chartdata = chartdata;
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    newSituation: function () {
      this.$store.dispatch("clear", this.$route.query.external_id);
      this.next();
    },
    next: function () {
      this.$push();
    },
  },
  mounted() {
    setInterval(this.changeDataset, 3750);
  },
};
</script>

<style lang="scss">
@import "../../node_modules/bootswatch/dist/litera/_variables.scss";

.wordslider {
  font-size: 24px;
  font-weight: 800;
}
.wordslider p {
  margin-bottom: 1rem;
}
.wordslider p,
.wordslider .textra {
  font-size: 1.5em;
}

.textra {
  color: $orange;
}
.qa {
  margin-bottom: 2rem;
}

.qa__q {
  color: $gray-600;
  border-left: 0.5rem solid $gray-600;
  padding-left: 0.5rem;
  font-style: italic;
}
</style>
