<template>
  <div class="main">
    <div class="progress" v-bind:style="style" />
    <div v-if="$store.state.message" class="main alert alert-warning full-width">
      <div class="message" v-html="$store.state.message" />
    </div>
    <div class="foyer">
      <div class="title mb-5">
        <div>
          <router-link v-if="isRecapitulatif" v-bind:to="stepRoute">
            <h2 aria-label="Retour à la page précédente">
              <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Retour
            </h2>
          </router-link>
          <h1 v-html="title" />
        </div>
        <router-link v-if="!isRecapitulatif" v-bind:to="recapitulatifLink" class="editor">
          <h2 class="editor" aria-label="Modifier vos réponses">📝</h2>
        </router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import _ from "lodash";

function findSibling(route) {
  if (
    route.fullPath === "/foyer/enfants/ajouter" ||
    route.name === "enfants/modifier"
  ) {
    return "/foyer/enfants";
  }

  if (
    route.fullPath === "/foyer/ressources/patrimoine" ||
    route.fullPath === "/foyer/ressources/fiscales"
  ) {
    return "/foyer/resultat";
  }
}

export default {
  name: "foyer",
  computed: {
    progress: function () {
      return (this.currentStepIndex * 2 - 1) / (2 * this.total - 1);
    },
    style: function () {
      return { width: `${100 * this.progress}%` };
    },
    steps: function () {
      const start = "/foyer/demandeur";
      return [start].concat(
        this.$state.full(start, this.$store.state.situation)
      );
    },
    total: function () {
      return this.steps.length;
    },
    stepRoute: function () {
      if (this.$route.query.depuis) {
        const res = this.$router.resolve(this.$route.query.depuis);
        if (res) {
          return res.route;
        }
      }
      return this.$route;
    },
    isRecapitulatif: function () {
      return _.startsWith(this.$route.fullPath, "/foyer/recapitulatif");
    },
    currentStepIndex: function () {
      let route = this.stepRoute;
      let idx = _.indexOf(this.steps, route.fullPath);
      if (idx >= 0) {
        return idx + 1;
      }
      idx = _.findIndex(this.steps, { name: route.name, params: route.params });
      if (idx >= 0) {
        return idx + 1;
      }

      idx = _.indexOf(this.steps, findSibling(route));
      if (idx >= 0) {
        return idx + 1;
      }

      return this.total;
    },
    title: function () {
      return this.$store.state.title;
    },
    recapitulatifLink: function () {
      return {
        path: "/foyer/recapitulatif",
        query: { depuis: this.$route.path },
      };
    },
  },
};
</script>

<style lang="scss">
@import "../../node_modules/bootswatch/dist/litera/_variables.scss";

.main {
  flex: 1 0 auto;
  min-height: 85vh;
}

.main.notification {
  display: block;
}

.foyer {
  padding: 1em;
  margin: 0 auto;
}

pre {
  text-align: left;
  white-space: break-spaces;
  width: 100%;
}

h1[tabindex="-1"] {
  outline: none;
}

.progress {
  height: 0.7em;
  background-color: $primary;
  transition: all 0.5s;
}

.message,
.title {
  margin: 0 auto;
}

.title {
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px lightgray;
}

.editor {
  margin-top: 3px;

  &:hover {
    text-decoration: none;
  }
}
</style>
