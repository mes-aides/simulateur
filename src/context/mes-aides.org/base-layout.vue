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
    <header role="banner" class="fr-header">
      <div class="fr-header__body">
        <div class="fr-container">
          <div class="fr-header__body-row">
            <router-link id="logo" to="/" class="navbar__home">
              <img
                class="navbar__logo"
                src="@/assets/images/mes-aides.org/logo.svg"
                alt="Logo de Mes-Aides.org"
              />
            </router-link>
            <Navigation />
          </div>
        </div>
      </div>
      <div
        id="modal-499"
        class="fr-header__menu fr-modal"
        aria-labelledby="button-500"
      >
        <div class="fr-container">
          <button
            class="fr-btn--close fr-btn"
            aria-controls="modal-499"
            title="Fermer"
          >
            Fermer
          </button>
          <div class="fr-header__menu-links"> </div>
        </div>
      </div>
    </header>
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
</template>

<script lang="ts">
import Navigation from "@/components/1j1s/navigation-1j1s.vue"
import layoutRouteMixin from "@/mixins/layout-route-mixin.js"

export default {
  name: "BaseLayout",
  components: {
    Navigation,
  },
  mixins: [layoutRouteMixin],
}
</script>
