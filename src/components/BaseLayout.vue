<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <router-link to="/" class="navbar-brand" id="logo">
        <img
          class="navbar__logo"
          src="./../../public/img/logo.svg"
          alt="Logo de Mes-Aides.org"
          height="30"
        />
      </router-link>
    </nav>

    <div class="container">
      <slot></slot>
    </div>

    <footer class="my-2">
      <hr/>
      <nav class="nav nav-pills nav-fill py-2">
        <router-link class="nav-link" to="/a-propos">
          <span class="fa fa-fw fa-question-circle" aria-hidden="true"></span>&nbsp;
          À propos
        </router-link>
        <router-link class="nav-link" to="/cgu">
          <span class="fa fa-fw fa-paperclip" aria-hidden="true"></span>&nbsp;
          Conditions d'utilisation
        </router-link>
        <router-link class="nav-link" to="/contact">
          <span class="fa fa-fw fa-envelope" aria-hidden="true"></span>&nbsp;
          Contact
        </router-link>
      </nav>
    </footer>
  </div>
</template>

<script>
export default {
  name: "BaseLayout",
  components: {},
};
</script>
