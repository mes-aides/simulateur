<template>
    <div class="wordslider">
        <p>Est-ce que ça vaut le coup de</p>

        <ul>
            <li>faire du freelance à côté</li>
            <li>faire 10 heures supplémentaire</li>
            <li>donner des cours de piano</li>
            <li>me mettre à mis-temps</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "WordSlider",
    components: {
    },
    props: {
    },
    methods: {
    }
};
</script>
<style scoped>
.wordslider {
  display: flex;
  font-size: 18px;
}
ul {
  list-style: none;
  padding: 0;
  text-align: left;
}
</style>
