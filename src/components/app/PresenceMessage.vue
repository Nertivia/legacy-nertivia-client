<template>
  <div class="presence-message" :class="messageType[1]">
    <div class="presense-contain">
      <span>
        <span
          class="username"
          @click="openUserInformation"
          @contextmenu.prevent="openMemberContext"
          >{{ creator.username }}</span
        >
        <span class="text">{{ messageType[0] }}</span>

        <span class="date">{{ date }}</span>
      </span>
    </div>
    <div
      class="drop-down-button"
      ref="drop-down-button"
      @click="openContextMenu"
    >
      <i class="material-icons">more_vert</i>
    </div>
  </div>
</template>

<script>
export default {
  props: ["creator", "type", "date"],
  components: {},
  data() {
    return {};
  },
  methods: {
    openUserInformation(event) {
      this.$emit("openUserInformation", event);
    },
    openContextMenu(event) {
      this.$emit("openContext", event);
    },
    openMemberContext(event) {
      this.$emit("openMemberContext", event);
    }
  },
  computed: {
    messageType() {
      switch (this.type) {
        case 1:
          return [this.$t("joined-the-server"), "join"];
          break;
        case 2:
          return [this.$t("left-the-server"), "leave"];
          break;
        case 3:
          return [this.$t("has-been-kicked"), "kick"];
          break;
        case 4:
          return [this.$t("has-been-banneed"), "ban"];
          break;
        default:
          return null;
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
$message-color: rgba(0, 0, 0, 0.3);

.presence-message {
  margin: 10px;
  display: flex;
  color: white;
  overflow: hidden;
}

.presense-contain {
  padding: 10px;
  display: table;
  color: white;
  overflow: hidden;
  background: $message-color;
  border-radius: 4px;
}

.presence-message .text {
  margin-left: 5px;
  font-size: 15px;
}
.presence-message .username {
  font-size: 15px;
  font-weight: bold;
}
.presence-message.join .text {
  color: #29bf12;
}
.presence-message.leave .text {
  color: rgb(150, 139, 139);
}
.presence-message.kick .text {
  color: #ff9914;
}
.presence-message.ban .text {
  color: #d92121;
}
.date {
  color: #d5e3e6;
  font-size: 10px;
  margin: auto auto auto 5px;
  font-weight: normal;
}
.drop-down-button .material-icons {
  font-size: 17px !important;
  user-select: none;
  cursor: pointer;
  margin-top: 5px;
}

.drop-down-button {
  opacity: 0;
  transition: 0.2s;
  position: relative;
  z-index: 1;
}

.container:hover .drop-down-button {
  opacity: 1;
}

.username {
  color: rgb(255, 255, 255);
  font-size: 14px;
  margin: auto 0;
  transition: 0.1s;
  cursor: pointer;
  font-weight: bold;
}

.username:hover {
  color: rgb(255, 255, 255);
  text-decoration: underline;
}
</style>
