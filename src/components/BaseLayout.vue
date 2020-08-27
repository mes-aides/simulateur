<template>
  <div>
    <header class="navbar" role="navigation">
      <div class="navbar__container">
        <nav>
          <router-link to="/" class="navbar__home" id="logo">
            <img class="navbar__logo" src="./../../public/img/logo.svg" alt="Logo de Mes-Aides.org" />
          </router-link>
        </nav>

        <div class="navbar__home">
        </div>
      </div>
    </header>

    <slot></slot>

    <footer class="footer">
      <nav class="container">
        <ul>
          <li><span class="fa fa-fw fa-life-ring" aria-hidden="true"></span>&nbsp;<router-link to="/sos">SOS</router-link></li>
          <li><span class="fa fa-fw fa-star" aria-hidden="true"></span>&nbsp;<router-link to="/liens-utiles">Liens utiles</router-link></li>
          <li><span class="fa fa-fw fa-question-circle" aria-hidden="true"></span>&nbsp;<router-link to="/a-propos">À propos</router-link></li>
        </ul>
        <ul>
          <li><span class="fa fa-fw fa-eur" aria-hidden="true"></span>&nbsp;<router-link to="/financement">Financement</router-link></li>
          <li><span class="fa fa-fw fa-pencil" aria-hidden="true"></span>&nbsp;<router-link to="/ameliorer">Contribuez</router-link></li>
          <li><span class="fa fa-fw fa-paperclip" aria-hidden="true"></span>&nbsp;<router-link to="/cgu">Conditions d'utilisation</router-link></li>
        </ul>
        <ul>
          <li><span class="fa fa-fw fa-thumbs-up" aria-hidden="true"></span>&nbsp;<router-link to="/social">Réseaux sociaux</router-link></li>
          <li><span class="fa fa-fw fa-envelope" aria-hidden="true"></span>&nbsp;<router-link to="/contact">Contact</router-link></li>
          <li><span class="fa fa-fw fa-newspaper-o" aria-hidden="true"></span>&nbsp;<a target="_blank" rel="noopener" href="https://c8282fe1.sibforms.com/serve/MUIEALeK4cr3WdAp5x5mopAKSViUl_8HOgRWycyFqxzf2U2EwnfJS8GJ2ragsE3WagiU-OmKq_HhRamKpgndNUMN6wnrNKxk-wpY19N5N90_j6_hWPTjJ4XRa0djFNUrsWcCAWJQWR1fQgZRVqfinNCIqcGYRZsedqB9iaqWecSDEdP_dZN0PITSsB78r7SJkWvuSsWDc8nEj9eI">Abonnez-vous à nos informations</a></li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'BaseLayout',
  components: { }
}
</script>

<style scoped lang="scss">
.navbar__container {
  padding: 0.2em;
  flex-wrap: nowrap;
  -ms-flex-direction: row;
  flex-direction: row;
}

@media (max-width: 600px) {
  .navbar__home span {
    font-size: 12px;
  }
}

@media (max-width: 450px) {
  .navbar__home {
    height: 20px;
  }
}

#logo:hover, #logo:focus {
    opacity: 1;
    background-color: unset;
}

footer, footer a {
  background-color: white;
  color: black;
  text-decoration: none;
}
</style>
