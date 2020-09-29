<template>
  <div class="spoiler" v-bind:class="{ spoiled: spoiled }" @click="spoil">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    spoiled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    spoil() {
      this.spoiled = true;
    }
  }
};

// vue 3
// import { reactive } from "vue";

// export default {
//   setup() {
//     const state = reactive({
//       spoiled: false
//     });

//     function spoil() {
//       state.spoiled = true;
//     }

//     return {
//       state,
//       spoil
//     };
//   }
// };
</script>

<style>
:root {
  --spoiler-color: 50, 50, 60;
}
</style>

<style scoped>
.spoiler {
  display: inline-flex;
  position: relative;
  border-radius: 3px;
  color: rgb(var(--spoiler-color));
  background-color: rgb(var(--spoiler-color));
  cursor: pointer;
  overflow: hidden;
}

.spoiler.spoiled {
  color: unset;
  background-color: rgb(var(--spoiler-color), 0.2);
  cursor: unset;
}
</style>
