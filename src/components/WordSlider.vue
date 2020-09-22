<template>
    <div class="wordslider">
        <p>Est-ce que ça vaut le coup de</p>
        <textra :data="words" :timer="3" filter="flip" :infinite='true' />
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
    /* display: flex; */
    font-size: 24px;
    font-weight: 800;
    /* align-items: center; */
    /* justify-content: center; */
    /* flex-direction: column; */
}
p {
  /* margin-top: 0; */
  margin-bottom: 1rem;
  /* margin-right: 5px; */
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
