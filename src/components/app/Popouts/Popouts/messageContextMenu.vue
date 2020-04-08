<template>
  <div
    class="drop-down-menu msg-context-popout"
    v-click-outside="outsideClick"
    ref="mainMenu"
  >
      <div class="item" @click="copyMessage" v-if="!isPrecense && highlightedText">
      <div class="material-icons">developer_board</div>
      <div class="name">Copy</div>
    </div>

    <div class="item" @click="showProfile" v-if="!serverMember">
      <div class="material-icons">account_circle</div>
      <div class="name">View Profile</div>
    </div>
    <div class="item" @click="showMemberContext" v-if="serverMember">
      <div class="material-icons">account_circle</div>
      <div class="name">User ></div>
    </div>

    <div class="item" @click="copyMessage" v-if="!isPrecense && !highlightedText">
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
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: "MESSAGE_CONTEXT"
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
      this.closeMenu();
      if (this.highlightedText) {
        document.execCommand("copy")
        return;
      }
      this.$clipboard(this.contextDetails.message);
    },
    async deleteMessage() {
      this.closeMenu();
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "DELETE_CONFIRM",
        messageID: this.contextDetails.messageID,
        channelID: this.contextDetails.channelID
      });
    },
    setPosition() {
      let y = this.contextDetails.y + 20;
      let x = this.contextDetails.x - 20;
      const mainMenu = this.$refs["mainMenu"];

      if (x + mainMenu.clientWidth > window.innerWidth) {
        x = window.innerWidth - mainMenu.clientWidth;
      }
      if (y + mainMenu.clientHeight > window.innerHeight) {
        y = window.innerHeight - mainMenu.clientHeight;
      }

      this.$el.style.top = y + "px";
      this.$el.style.left = x + "px";
    },
    showProfile() {
      let uniqueID;
      if (this.serverMember) {
        uniqueID = this.serverMember.uniqueID;
      } else {
        uniqueID = this.contextDetails.uniqueID;
      }
      this.$store.dispatch("setUserInformationPopout", uniqueID);
      this.closeMenu();
    },
    showMemberContext() {
      const details = {
        serverID: this.serverMember.server_id,
        uniqueID: this.serverMember.uniqueID,
        x: this.contextDetails.x,
        y: this.contextDetails.y
      };
      this.closeMenu();

      setTimeout(() => {
        this.$store.dispatch("setServerMemberContext", details);
      }, 100);
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
    highlightedText() {
      return window.getSelection().type === "Range"
    },
    serverMember() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      if (this.currentTab !== 2) return undefined;

      return serverMembers.find(
        sm =>
          sm.uniqueID === this.contextDetails.uniqueID &&
          sm.server_id === this.currentServerID
      );
    },
    currentServerID() {
      return this.$store.getters["servers/currentServerID"];
    },
    currentTab() {
      return this.$store.getters.currentTab;
    },
    contextDetails() {
      return this.$store.getters.popouts.allPopout;
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
    isSelfServerOwner() {
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
    //if precense message (join /ban/leave/kick)
    isPrecense() {
      return this.contextDetails.messageType >= 1;
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
      return !!this.isSelfServerOwner;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ContextMenu.scss";
</style>
