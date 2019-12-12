<template>
  <div class="drop-down-menu" v-click-outside="outsideClick">
    <div class="item" @click="viewProfile">View Profile</div>
    <div class="item" @click="copyUserTag">Copy User@Tag</div>
    <div class="item" @click="copyID">Copy ID</div>
    <div class="item warn" v-if="showKickBanOption" @click="kickMember">
      Kick
    </div>
    <div class="item warn" v-if="showKickBanOption" @click="banMember">Ban</div>
  </div>
</template>

<script>
import messagesService from "@/services/messagesService";
import ServerService from "../../../../services/ServerService";
export default {
  data() {
    return {};
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setServerMemberContext", {
        server_id: null,
        uniqueID: null,
        x: null,
        y: null
      });
    },
    outsideClick(event) {
      this.closeMenu();
    },
    viewProfile() {
      const uniqueID = this.contextDetails.uniqueID;
      this.closeMenu();
      this.$store.dispatch("setUserInformationPopout", uniqueID);
    },
    copyUserTag() {
      const user = this.$store.getters["members/members"][
        this.contextDetails.uniqueID
      ];
      const userTag = user.username + "@" + user.tag;
      this.closeMenu();
      this.$clipboard(userTag);
    },
    copyID() {
      const uniqueID = this.contextDetails.uniqueID;
      this.$clipboard(uniqueID);
      this.closeMenu();
    },
    async kickMember() {
      const serverID = this.contextDetails.serverID;
      const uniqueID = this.contextDetails.uniqueID;
      this.closeMenu();
      const { ok, error, result } = await ServerService.kickMember(
        serverID,
        uniqueID
      );
    },
    async banMember() {
      const serverID = this.contextDetails.serverID;
      const uniqueID = this.contextDetails.uniqueID;
      this.closeMenu();
      const { ok, error, result } = await ServerService.banMember(
        serverID,
        uniqueID
      );
    },
    setPosition() {
      const y = this.contextDetails.y;
      const x = this.contextDetails.x;

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
        serverID,
        uniqueID
      } = this.$store.getters.popouts.serverMemberContext;
      return {
        x,
        y,
        serverID,
        uniqueID
      };
    },
    serverMember() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      return serverMembers.find(
        m =>
          m.uniqueID === this.user.uniqueID &&
          m.server_id === this.contextDetails.serverID &&
          m.type === "OWNER"
      );
    },
    user() {
      return this.$store.getters.user;
    },
    showKickBanOption() {
      // Dont show kick and ban option for Fishie and Fullipsp :P
      if (
        this.contextDetails.uniqueID === "763085765093499318" ||
        this.contextDetails.uniqueID === "825242960222351869"
      )
        return;
      // Only show kick and ban option if the user is server owner and not us
      if (this.user.uniqueID === this.contextDetails.uniqueID) return false;
      return !!this.serverMember;
    }
  }
};
</script>

<style lang="scss" scoped>
.drop-down-menu {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 99999;
  user-select: none;
  color: white;
}

.item {
  padding: 10px;
  border-radius: 5px;
  transition: 0.3s;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: rgba(46, 46, 46, 0.651);
  }
  &.warn {
    color: rgb(255, 59, 59);
  }
}
</style>
