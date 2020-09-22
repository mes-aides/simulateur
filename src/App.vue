<template>
  <BaseLayout id="app">
    <router-view/>
  </BaseLayout>
</template>

<script>

import BaseLayout from '@/components/BaseLayout.vue'

export default {
  name: 'app',
  components: {
    BaseLayout,
  }
}
</script>
