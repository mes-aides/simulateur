<template>
  <form>
    <div>
      <p>Étant donné que vous êtes rattaché fiscalement à vos parents, certaines aides dépendent de leur situation.
      </p>
    </div>

    <label class="form__group">
      Combien d'enfants (vous y compris) sont à la charge de vos parents&nbsp;?
      <input min="1" type="number" v-select-on-click v-model.number="foyer_fiscal.bourse_criteres_sociaux_nombre_enfants_a_charge">
    </label>

    <label class="form__group">
      Et combien (vous y compris) font des études supérieures&nbsp;?
      <input min="1" type="number" v-select-on-click v-model.number="foyer_fiscal.bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur">
    </label>

    <label class="form__group">
    Quel est le montant du revenu fiscal de référence de vos parents&nbsp;?
      <input type="number" v-select-on-click v-model.number="demandeur.bourse_criteres_sociaux_base_ressource">
    </label>



    <div class="form__group">
      <label class="form__group" for="postal-code">Code postal de la commune de vos parents
        <input id="postal-code" v-model="demandeur.FO_bourse_criteres_sociaux_commune_domicile_familial_code_postal" v-on:input="fetchCommunes()">
        <p class="notification warning" v-if="displayPostalCodeWarning">
          Ce code postal est invalide
        </p>
      </label>

      <div class="form__group">
        <p v-if="retrievingCommunes"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
        <div v-show="communes && communes.length">
          <label for="commune">Ville</label>
          <select
            v-model="demandeur.bourse_criteres_sociaux_commune_domicile_familial"
            id="commune">
            <option v-for="commune in communes" v-bind:value="commune.code" v-bind:key="commune.code">
              {{ commune.nom }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="text-right">
      <button type="submit" class="button large" v-on:click.prevent="next">Valider</button>
    </div>
  </form>
</template>

<script>
// import Commune from '@/lib/Commune'

export default {
  name: 'parents',
  data () {
    let situation = this.$store.state.situation
    let demandeur = Object.assign({}, situation.demandeur)
    let foyer_fiscal = Object.assign({}, situation.foyer_fiscal)

    demandeur.bourse_criteres_sociaux_commune_domicile_familial = demandeur.bourse_criteres_sociaux_commune_domicile_familial || null
    demandeur.FO_bourse_criteres_sociaux_commune_domicile_familial_code_postal = demandeur.FO_bourse_criteres_sociaux_commune_domicile_familial_code_postal || null

    return {
      demandeur,
      foyer_fiscal,
      displayPostalCodeWarning: false,
      retrievingCommunes: false,
    }
  },
  computed: {
    code_postal: function() {
      return this.demandeur.FO_bourse_criteres_sociaux_commune_domicile_familial_code_postal
    },
    communes: function() {
      let q = this.$store.state.commune.queries
      return q && q[this.code_postal] && !q[this.code_postal].fetching && q[this.code_postal].results
    }
  },
  mounted: function () {
    this.fetchCommunes()
  },
  methods: {
    fetchCommunes: function() {
      if (! this.code_postal || this.code_postal.length !== 5) {
          return
      }

      this.$store.dispatch('commune/fetch', this.code_postal)
      .then(() => {
        let c = this.$store.getters['commune/getMostPopulated'](this.code_postal, this.demandeur.bourse_criteres_sociaux_commune_domicile_familial)
        if (c) {
          this.demandeur.bourse_criteres_sociaux_commune_domicile_familial = c.code
        }
      })
    },
    next: function() {
      this.$store.dispatch('updateIndividu', this.demandeur)
      this.$store.dispatch('updateFoyerFiscal', this.foyer_fiscal)
      this.$push()
    },
  }
}
</script>
