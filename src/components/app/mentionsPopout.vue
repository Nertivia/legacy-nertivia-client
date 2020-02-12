<template>
  <div class="list">
    <div
      v-for="(member, index) in list"
      :key="member.uniqueID"
      :class="{ item: true, selected: index === mentionIndex }"
      @mouseenter="hoverEvent"
      @click="clickEvent"
    >
      <img class="avatar" :src="avatarPath + member.avatar + '?type=webp'" />
      <div class="username">{{ member.username }}</div>
      <div class="tag">:{{ member.tag }}</div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
import config from "@/config.js";
export default {
  props: ["list"],
  data() {
    return {
      avatarPath: config.domain + "/avatars/"
    };
  },
  computed: {
    mentionIndex() {
      return this.$store.getters["mentionsListModule/getMentionIndex"];
    }
  },
  watch: {
    list() {
      this.changeIndex(0);
    }
  },
  mounted() {
    bus.$on("mentions:key", this.KeySwitch);
  },
  destroyed() {
    bus.$off("mentions:key", this.KeySwitch);
    this.$store.dispatch("mentionsListModule/setMentionsArray", null);
  },
  methods: {
    changeIndex(index) {
      this.$store.dispatch("mentionsListModule/changeIndex", index);
    },
    hoverEvent(event) {
      const mention = event.target.closest(".item");
      const parent = event.target.parentElement.children;
      if (!mention) return;
      const index = [...parent].findIndex(el => el === mention);
      if (index >= 0) this.changeIndex(index);
    },
    KeySwitch(key) {
      if (key == "up") {
        if (this.mentionIndex == 0)
          return this.changeIndex(this.$props.list.length - 1);

        this.changeIndex(this.mentionIndex - 1);
      }
      if (key == "down") {
        if (this.mentionIndex == this.$props.list.length - 1)
          return this.changeIndex(0);
        this.changeIndex(this.mentionIndex + 1);
      }
    },
    clickEvent() {
      bus.$emit("mentions:Selected");
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
