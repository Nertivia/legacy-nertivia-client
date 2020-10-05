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
  --spoiler-color: 30, 30, 40;
}
</style>

<style scoped>
.spoiler {
  position: relative;
  display: inline-flex;
  border-radius: 3px;
  overflow: hidden;
}

.spoiler::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(var(--spoiler-color));
  cursor: pointer;
  z-index: 1;
}

.spoiler.spoiled {
  background-color: rgb(var(--spoiler-color), 0.2);
}

.spoiler.spoiled::after {
  visibility: hidden;
}
</style>