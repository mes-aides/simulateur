<template>
  <fieldset>
    <legend>Nationalité</legend>
    <label>
      <input type="radio" name="nationalite" v-model="zone" value="fr" />
      Française
    </label>
    <label>
      <input type="radio" name="nationalite" v-model="zone" value="ue" />
      Européenne
    </label>
    <label>
      <input type="radio" name="nationalite" v-model="zone" value="autre" />
      Non européenne
    </label>
  </fieldset>
</template>


<script>

import Nationality from '@/lib/Nationality'


export default {
  name: 'NationalityChoice',
  components: {
  },
  props: {
    value: String
  },
  computed: {
    zone: {
        get: function() {
          return Nationality.getZone(this.value)
        },
        set: function(value) {
          this.$emit('input', Nationality.getCountryCodeByNationality(value))
        }
    }
  }
}
</script>
