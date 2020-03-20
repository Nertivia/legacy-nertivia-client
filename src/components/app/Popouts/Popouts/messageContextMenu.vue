<template>
  <div class="drop-down-menu msg-context-popout" v-click-outside="outsideClick">
    <div class="item" @click="copyMessage" v-if="!isPrecense">
      <div class="material-icons">developer_board</div>
      <div class="name">Copy</div>
    </div>
    <div class="item" @click="editMessage" v-if="showEditOption && !isPrecense">
      <div class="material-icons">edit</div>
      <div class="name">Edit</div>
    </div>
    <div class="item warn" @click="deleteMessage" v-if="showDeleteOption">
      <div class="material-icons">delete</div>
      <div class="name">Delete</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setMessageContext", {
        messageID: null,
        x: null,
        y: null
      });
    },
    outsideClick(event) {
      const target = event.target;
      if (target.closest(".drop-down-button")) return;
      this.closeMenu();
    },
    editMessage() {
      this.$store.dispatch("setEditMessage", {
        channelID: this.contextDetails.channelID,
        messageID: this.contextDetails.messageID,
        message: this.contextDetails.message,
        color: this.contextDetails.color
      });
      this.closeMenu();
    },
    copyMessage() {
      this.$clipboard(this.contextDetails.message);
      this.closeMenu();
    },
    async deleteMessage() {
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "DELETE_CONFIRM",
        messageID: this.contextDetails.messageID,
        channelID: this.contextDetails.channelID
      });
      this.closeMenu();
    },
    setPosition() {
      const y = this.contextDetails.y + 20;
      const x = this.contextDetails.x - 20;

      this.$el.style.top = y + "px";
      this.$el.style.left = x + "px";
    }
  },
  mounted() {
    this.setPosition();
  },
  watch: {
    contextDetails() {
      this.setPosition();
    }
  },
  computed: {
    contextDetails() {
      const {
        x,
        y,
        messageID,
        message,
        channelID,
        uniqueID,
        type,
        color
      } = this.$store.getters.popouts.messageContextMenu;
      return {
        x,
        y,
        messageID,
        message,
        channelID,
        uniqueID,
        type,
        color
      };
    },
    serverID() {
      const serverChannelIDs = Object.entries(
        this.$store.getters["servers/channelsIDs"]
      );
      const find = serverChannelIDs.find(c => {
        return c[1].includes(this.contextDetails.channelID);
      });
      return find ? find[0] : undefined;
    },
    serverMember() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      return serverMembers.find(
        m =>
          m.uniqueID === this.user.uniqueID &&
          m.server_id === this.serverID &&
          m.type === "OWNER"
      );
    },
    user() {
      return this.$store.getters.user;
    },
    //if precense
    isPrecense() {
      return this.contextDetails.type >= 1;
    },
    showEditOption() {
      // Only show edit option if the user is us.
      return this.user.uniqueID === this.contextDetails.uniqueID;
    },
    showDeleteOption() {
      // Only show delete option if the user is us or server owner is us.
      if (this.user.uniqueID === this.contextDetails.uniqueID) {
        return true;
      }
      return !!this.serverMember;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ContextMenu.scss";
</style>
