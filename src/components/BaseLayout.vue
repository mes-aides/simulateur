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
          <li><span class="fa fa-fw fa-question-circle" aria-hidden="true"></span>&nbsp;<router-link to="/a-propos">À propos</router-link></li>
        </ul>
        <ul>
          <li><span class="fa fa-fw fa-paperclip" aria-hidden="true"></span>&nbsp;<router-link to="/cgu">Conditions d'utilisation</router-link></li>
        </ul>
        <ul>
          <li><span class="fa fa-fw fa-envelope" aria-hidden="true"></span>&nbsp;<router-link to="/contact">Contact</router-link></li>
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
