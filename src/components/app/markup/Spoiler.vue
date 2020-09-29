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

<style scoped>
.spoiler {
  display: inline-flex;
  position: relative;
  border-radius: 3px;
  color: #010101;
  background-color: #010101;
  cursor: pointer;
  overflow: hidden;
}

.spoiler.spoiled {
  color: unset;
  background-color: #01010120;
  cursor: unset;
}
</style>
