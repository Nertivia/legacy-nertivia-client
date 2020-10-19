<template>
  <div class="content disclaimer">
    <div class="title">Disclaimer:</div>
    <p>
      Nertivia is just an open-source fun project made by me and a few friends.
      Please don't expect big features or a bug-free experience.
    </p>
    <p>
      Not everyone has the skill to be able to do everything. I am only an
      amateur coder and not so good with design and etc.
    </p>
    <div class="buttons">
      <div class="button" @click="$emit('understood')">I Understood</div>
      <div class="button alert" v-if="!hideClose" @click="$emit('close')">
        Close
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["hideClose"]
};
</script>

<style lang="scss" scoped>
@import "@/styles/global";
.button {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  outline: none;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  justify-items: center;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  box-shadow: 0px 0px 10px 2px black;
  background: $primary-button-color;
  margin-bottom: 5px;
  margin-top: 10px;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
  &:focus {
    opacity: 1;
  }
}
.disclaimer {
  display: flex;
  flex-direction: column;
  .title {
    font-size: 20px;
    margin-top: 10px;
    align-self: center;
  }
  p {
    font-size: 14px;
    opacity: 0.8;
    text-align: center;
  }
  .buttons {
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .button {
    background: $primary-button-color;
    align-self: center;
    width: initial;
    height: initial;
    padding: 5px;
    border-radius: 4px;
    margin: 10px;
    &.alert {
      background: rgb(255, 81, 81);
    }
  }
}
</style>
