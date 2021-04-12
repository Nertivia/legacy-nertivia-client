<template>
  <div class="list">
    <div
      v-for="(item, i) in list"
      :key="i"
      :class="{ item: true, selected: index === i }"
      @mouseenter="hoverEvent"
      @click="clickEvent"
    >
      <div class="material-icons icon">code</div>
      <div class="command-name">{{ item.botCommand.c }}</div>
      <div class="tag">{{ item.botCommand.a }}</div>
      <profile-picture
        class="avatar"
        :avatar="item.member.avatar"
        :id="item.member.id"
        animationPadding="0"
        :hover="false"
        size="15px"
      />
      <div class="username">{{ item.member.username }}</div>
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
  background: rgba(34, 34, 34, 0.8);
  box-shadow: 0px 0px 5px 1px rgb(0, 0, 0);
  backdrop-filter: blur(10px);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.3s;
  user-select: none;
  cursor: default;
}
.avatar {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border-radius: 50%;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: auto;
  margin-right: 5px;
}

.item {
  display: flex;
  padding: 5px;
  align-content: center;
  align-items: center;
  cursor: pointer;
}
.username {
  font-size: 14px;
  opacity: 0.6;
}
.command-name {
  font-size: 14px;
}
.tag {
  margin-left: 5px;
  color: rgb(255, 117, 24);
  font-size: 14px;
  margin-right: 10px;
}
@media (max-height: 441px) {
  .list {
    max-height: 150px;
  }
}
.icon {
  opacity: 0.4;
  margin-right: 5px;
  font-size: 14px;
}
</style>
