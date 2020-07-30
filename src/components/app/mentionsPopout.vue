<template>
  <div class="list">
    <div
      v-for="(member, i) in list"
      :key="member.uniqueID"
      :class="{ item: true, selected: index === i }"
      @mouseenter="hoverEvent"
      @click="clickEvent"
    >
      <profile-picture
        class="avatar"
        :avatar="member.avatar"
        :uniqueID="member.uniqueID"
        animationPadding="0"
        :hover="false"
        size="25px"
      />
      <div class="username">{{ member.username }}</div>
      <div class="tag">:{{ member.tag }}</div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import ProfilePicture from "@/components/global/ProfilePictureTemplate";
export default {
  components: { ProfilePicture },
  props: ["list"],
  data() {
    return {
      avatarPath: config.nertiviaCDN,
      index: 0
    };
  },
  watch: {
    list() {
      this.index = 0;
    }
  },
  methods: {
    hoverEvent(event) {
      const mention = event.target.closest(".item");
      const parent = event.target.parentElement.children;
      if (!mention) return;
      const index = [...parent].findIndex(el => el === mention);
      if (index >= 0) this.index = index;
    },
    KeySwitch(key) {
      if (key == "up") {
        if (this.index == 0) return (this.index = this.$props.list.length - 1);

        this.index = this.index - 1;
      }
      if (key == "down") {
        if (this.index == this.$props.list.length - 1) return (this.index = 0);
        this.index = this.index + 1;
      }
    },
    clickEvent() {
      this.$emit("chosen");
    }
  }
};
</script>

<style scoped>
.selected {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}
.list {
  position: absolute;
  bottom: -35px;
  left: 50px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 2;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0px 0px 20px 5px #000000bd;
  backdrop-filter: blur(5px);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.3s;
  user-select: none;
  cursor: default;
}
.avatar {
  width: 25px;
  height: 25px;
  margin-right: 5px;
  border-radius: 50%;
}

.item {
  display: flex;
  padding: 5px;
  align-content: center;
  align-items: center;
  cursor: pointer;
}
.tag {
  color: rgba(255, 255, 255, 0.3);
}
@media (max-height: 441px) {
  .list {
    max-height: 150px;
  }
}
</style>
