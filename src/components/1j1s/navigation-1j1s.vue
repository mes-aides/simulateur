<template>
  <nav
    id="navigation"
    class="fr-nav"
    role="navigation"
    aria-label="Menu principal"
  >
    <ul class="fr-nav__list">
      <li
        v-for="(element, index) in navigation"
        :key="element.label"
        class="fr-nav__item"
        :class="{ 'fr-nav__item--right': element?.alignRight }"
      >
        <router-link
          v-if="!element.children"
          :aria-current="element.active || null"
          :to="element.link"
          class="fr-nav__link"
        >
          {{ element.label }}
        </router-link>
        <button
          v-if="element.children"
          :aria-current="element.active || null"
          aria-expanded="false"
          :aria-controls="`nav-menu-${index}`"
          class="fr-nav__btn"
          :title="element.active ? 'Onglet actif' : null"
          @keydown.esc="escapeKeyHandler"
          >{{ element.label }}</button
        >
        <div
          v-if="
            element.children &&
            element.children.some((subelement) => subelement?.children)
          "
          :id="`nav-menu-${index}`"
          class="fr-collapse fr-mega-menu"
          tabindex="-1"
          @keydown.esc="escapeKeyHandler"
        >
          <div class="fr-container fr-container--fluid fr-container-lg">
            <button
              class="fr-btn--close fr-btn"
              :aria-controls="`nav-menu-${index}`"
              >Fermer</button
            >
            <div class="fr-grid-row fr-grid-row-lg--gutters">
              <div
                v-for="category in element.children"
                :key="category.label"
                class="fr-col-12 fr-col-lg-3"
                :data-submenu="!category.link"
              >
                <h2 class="fr-mega-menu__category">
                  <router-link
                    v-if="category.link"
                    :to="subelement.link"
                    class="fr-nav__link"
                  >
                    {{ subcategory.label }}
                  </router-link>
                  <span v-else class="fr-nav__link">{{ category.label }}</span>
                </h2>
                <p v-if="category.legend" class="fr-p-2w">{{
                  category.legend
                }}</p>
                <ul v-if="category.children" class="fr-mega-menu__list">
                  <li
                    v-for="subcategory in category.children"
                    :key="subcategory.label"
                  >
                    <router-link :to="subelement.link" class="fr-nav__link">
                      {{ subcategory.label }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="element.children"
          :id="`nav-menu-${index}`"
          class="fr-collapse fr-menu"
          @keydown.esc="escapeKeyHandler"
        >
          <ul class="fr-menu__list">
            <li
              v-for="subelement in element.children"
              :key="subelement.label"
              class="fr-nav__item"
            >
              <router-link :to="subelement.link" class="fr-nav__link">
                {{ subelement.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
function escapeKeyHandler(event) {
  if (event.target.getAttribute("aria-expanded")) {
    // close standard drop-down menu
    event.target.setAttribute("aria-expanded", false)
  } else if (event.target.previousSibling.getAttribute("aria-expanded")) {
    // close mega menu and put focus on opening button
    event.target.previousSibling.focus({ focusVisible: true })
    event.target.previousSibling.setAttribute("aria-expanded", false)
  }
}
const navigation = [
  {
    label: "Menu",
    children: [
      { label: "Obtenir de l'aide", link: "/liens-utiles" },
      { label: "Qui sommes nous ?", link: "/a-propos" },
      { label: "Comment nous aider ?", link: "/ameliorer" },
    ],
  },
]
</script>
