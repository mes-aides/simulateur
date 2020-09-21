<template>
    <div class="wordslider">
        <p>Est-ce que ça vaut le coup de</p>
        <textra :data="words" :timer="3" filter="simple" :infinite='true' />
    </div>
</template>

<script>
export default {
    name: "WordSlider",
    data: () => ({
        words: [
            "faire du freelance à côté.",
            "faire 10 heures supplémentaire.",
            "donner des cours de piano.",
            "me mettre à mis-temps."
        ],
        current: 2
    }),
    props: {},
    methods: {}
};
</script>
<style scoped>
.wordslider {
    display: flex;
    font-size: 18px;
    margin-top: 2rem;
    margin-bottom: 2rem;
    align-items: center;
    justify-content: center;
}
p {
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 5px;
  /* width: 325px; */
  /* display: inline */
}
p,
.textra {
    font-size: 1.5em;
    /* flex: 1; */
}

.textra {
    color: orange;
}
</style>
