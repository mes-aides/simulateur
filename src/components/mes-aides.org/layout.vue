<template>
  <div class="fr-skiplinks">
    <nav
      ref="skipLinks"
      class="fr-container"
      role="navigation"
      aria-label="Accès rapide"
    >
      <ul class="fr-skiplinks__list">
        <li>
          <router-link
            class="fr-link"
            :to="{ hash: '#main' }"
            aria-current="none"
            >Contenu</router-link
          >
        </li>
        <li>
          <router-link
            class="fr-link"
            :to="{ hash: '#navigation' }"
            aria-current="none"
            >Menu</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
  <div class="aj-page--full-height">
    <HeaderMesAides>
      <div ref="navigation" tabindex="-1"> <NavigationMesAides /></div>
    </HeaderMesAides>
    <main
      id="main"
      ref="main"
      role="main"
      class="fr-container fr-container--fluid aj-main-container"
      tabindex="-1"
    >
      <slot />
    </main>
  </div>
  <div ref="footer" tabindex="-1">
    <Footer1J1S />
  </div>
</template>

<script lang="ts">
import HeaderMesAides from "@/components/mes-aides.org/header.vue"
import layoutRouteMixin from "@/mixins/layout-route-mixin.js"
import NavigationMesAides from "@/components/mes-aides.org/navigation.vue"

export default {
  name: "MesAidesLayout",
  components: {
    HeaderMesAides,
    NavigationMesAides,
  },
  mixins: [layoutRouteMixin],
}
</script>
