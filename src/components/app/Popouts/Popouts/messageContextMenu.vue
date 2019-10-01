<template>
  <div class="drop-down-menu" v-click-outside="outsideClick">
    <div class="item" @click="copyMessage" >Copy</div>
    <div class="item" @click="editMessage" v-if="showEditOption">Edit</div>
    <div class="item warn" @click="deleteMessage" v-if="showDeleteOption">Delete</div>
  </div>
</template>


<script>
import messagesService from '@/services/messagesService';
export default {
  data() {
    return {

    };
  },
  methods: {
    closeMenu() {
      this.$store.dispatch('setMessageContext', {messageID: null, x: null, y: null});
    },
    outsideClick(event) {
      const target = event.target;
      if (target.closest('.drop-down-button')) return;
      this.closeMenu();
    },
    editMessage() {
      this.$store.dispatch("setEditMessage", {
        channelID: this.contextDetails.channelID,
        messageID: this.contextDetails.messageID,
        message: this.contextDetails.message
      });
      this.closeMenu();
    },
    copyMessage() {
      this.$clipboard(this.contextDetails.message);
      this.closeMenu();
    },
    async deleteMessage() {
      messagesService.delete(this.contextDetails.messageID, this.contextDetails.channelID);
      this.closeMenu();
    },
    setPosition() {
      const y = this.contextDetails.y + 20;
      const x = this.contextDetails.x - 20;

      this.$el.style.top = y  + "px";
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
      const { x, y, messageID, message, channelID, uniqueID } = this.$store.getters.popouts.messageContextMenu;
      return { 
        x,
        y,
        messageID,
        message,
        channelID,
        uniqueID
      }
    },
    serverID() {
      const serverChannelIDs = Object.entries(this.$store.getters['servers/channelsIDs']);
      const find = serverChannelIDs.find(c => {
        return c[1].includes(this.contextDetails.channelID)
      });
      return find ? find[0] : undefined; 
    },
    serverMember () {
      const serverMembers = this.$store.getters['servers/serverMembers'];
      return serverMembers.find(m => 
        m.uniqueID === this.user.uniqueID && m.server_id === this.serverID && m.type === "OWNER"
      )
    },
    user() {
      return this.$store.getters.user;
    },
    showEditOption() {
      // Only show edit option if the user is us.
      return this.user.uniqueID === this.contextDetails.uniqueID
    },
    showDeleteOption() {
      // Only show delete option if the user is us or server owner is us.
      if (this.user.uniqueID === this.contextDetails.uniqueID){
        return true;
      }
      return !!this.serverMember;
    }
  },

};
</script>


<style lang="scss" scoped>
.drop-down-menu {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(31, 31, 31, 0.895);
  z-index: 99999;
  padding: 5px;
  border-radius: 5px;
  user-select: none;
  color: white;
}

.item {
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
  transition: 0.3s;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: rgb(46, 46, 46);
  }
  &.warn {
    color: rgb(255, 59, 59);
  }
}

</style>
