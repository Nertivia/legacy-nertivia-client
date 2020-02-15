<template>
  <div class="emoji-item">
    <div
      v-if="!emoji.emojiID"
      class="emoji"
      :style="{ backgroundPosition: emoji.pos }"
    />
    <div
      v-else
      class="emoji custom"
      :style="{
        backgroundImage: `url(${customEmojiUrl + emoji.emojiID})`
      }"
    />
  </div>
</template>

<script>
import config from "@/config.js";
export default {
  props: ["emoji"],
  data() {
    return {
      customEmojiUrl: config.domain + "/media/"
    };
  }
};
</script>

<style lang="scss" scoped>
.emoji-item {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 37px;
  width: 37px;
  flex-shrink: 0;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
.emoji {
  background-image: url("../../../assets/emojiSprites.png");
  background-position: 0px 0px;
  background-repeat: no-repeat;
  background-size: 1000px;
  user-select: none;
  height: 25px;
  width: 25px;
  flex-shrink: 0;
  &.custom {
    background-size: contain;
    background-position: center;
  }
}
</style>
