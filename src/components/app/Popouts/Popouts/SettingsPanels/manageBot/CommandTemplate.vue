<template>
  <div class="command">
    <custom-input
      class="input"
      :value="initialCMD"
      type="text"
      @input="$emit('cmd-input', $event.target.value)"
      placeholder="e.g. mute"
    />
    <custom-input
      class="input"
      @input="$emit('args-input', $event.target.value)"
      :value="initialArgs"
      type="text"
      placeholder="e.g. username 15m"
    />
    <div class="button" @click="$emit('delete')">{{ $t("delete") }}</div>
  </div>
</template>

<script>
import CustomInput from "@/components/global/CustomInput";
export default {
  props: ["initialCMD", "initialArgs"],
  components: { CustomInput }
};
</script>

<style lang="scss" scoped>
.command {
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  padding-bottom: 0;
  padding-top: 0;
  align-self: center;
  display: flex;
}
.command:nth-child(odd) {
  background: rgba(255, 255, 255, 0.2);
}
.input {
  margin-left: 5px;
  margin-right: 5px;
  width: 135px;
  background: transparent;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  opacity: 0.7;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
</style>

<style>
.command input {
  background: transparent !important;
}
</style>
