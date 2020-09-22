<template>
  <div>
    <nav class="navbar navbar-light bg-light">
        <router-link to="/" class="navbar-brand" id="logo">
          <img class="navbar__logo" src="./../../public/img/logo.svg" alt="Logo de Mes-Aides.org" height="30" />
        </router-link>
    </nav>

    <div class="container">
      <slot></slot>
    </div>


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
