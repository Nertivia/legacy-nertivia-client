<template>
  <div class="bot-buttons">
    <BotButton v-for="button in message.buttons" :key="button.id" :button="button" :message="message" />
  </div>
</template>

<script>
import BotButton from './BotButton';

export default {
  components: {BotButton},
  props: ["message"]
};
</script>

<style scoped lang="scss">
.bot-buttons {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}
</style>
