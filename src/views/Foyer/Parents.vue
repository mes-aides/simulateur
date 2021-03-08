<template>
  <form>
    <div>
      <p>Certaines aides dépendent de la situation de vos parents.
      </p>
    </div>

    <label class="form__group">
      Combien d'enfants (vous y compris) sont à la charge de vos parents ?
      <input type="number" v-select-on-click v-model.number="foyer_fiscal.bourse_criteres_sociaux_nombre_enfants_a_charge">
    </label>

    <label class="form__group">
      Et combien (vous y compris) font des études supérieures ?
      <input type="number" v-select-on-click v-model.number="foyer_fiscal.bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur">
    </label>

    <div class="form__group">
      <label class="form__group" for="postal-code">Code postal de la commune de vos parents
        <input id="postal-code" v-model="code_postal">
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

    demandeur.bourse_criteres_sociaux_commune_domicile_familial = demandeur.bourse_criteres_sociaux_commune_domicile_familial || '33060'

    return {
      demandeur,
      foyer_fiscal,
      code_postal: '33610',
      displayPostalCodeWarning: false,
      retrievingCommunes: false,
      communes: [{
        code: '33060',
        nom: 'Canéjan'
      }]
    }
  },
  methods: {
    next: function() {
      this.$store.dispatch('updateIndividu', this.demandeur)
      this.$store.dispatch('updateFoyerFiscal', this.foyer_fiscal)
      this.$push()
    },
  }
}
</script>
