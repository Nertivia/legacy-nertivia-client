  <template>
  <div class="right-panel">
    <heading
      :uniqueID="
        recipients && recipients.length ? recipients[0].uniqueID : undefined
      "
      :type="
        currentChannelID && channel && !channel.server_id
          ? 1
          : channel && channel.server_id
          ? 2
          : 0
      "
      :name="currentChannelID ? channelName : `${$t('welcome-back')}, ${user.username}!`"
    />
    <transition name="fade" mode="out-in">
      <div class="loading" v-if="loadingMessages">
        <spinner />
      </div>
      <message-logs
        v-else-if="currentChannelID && currentChannelMessages"
        :key="currentChannelID"
        :isTyping="typingRecipients[currentChannelID]"
      />

      <div class="no-channel-selected" v-if="!currentChannelID">
        <div class="material-icons">
          {{ type === 0 ? "forum" : type === 1 ? "dns" : "question" }}
        </div>
        <div class="message">
          {{ (!type && $t("select-person-message")) || $t("select-a-server") }}
        </div>
      </div>
    </transition>
    <ChatInputArea
      :typingRecipients="typingRecipients"
      :type="type"
      v-if="currentChannelID"
    />
    <div
      class="no-message-permission"
      v-if="
        hasAdminRole
          ? false
          : sendChannelMessagePermission === false ||
            roleSendMessagePermission === false
      "
    >
      $t("missing-send-messages-permission")
    </div>
  </div>
</template>

<script>
import ChatInputArea from "@/components/app/ChatInputArea";
import { bus } from "../../main";
import Spinner from "@/components/global/Spinner.vue";
import heading from "@/components/app/MessagePanel/Heading.vue";
import MessageLogs from "@/components/app/MessageLogs.vue";
import windowProperties from "@/utils/windowProperties";
import { containsPerm, permissions } from "../../utils/RolePermissions";
import botsService from "@/services/botsService";

export default {
  props: ["type"], // type 0: dm; type 1: server
  components: {
    Spinner,
    heading,
    MessageLogs,
    ChatInputArea
  },
  data() {
    return {
      typingRecipients: {}
    };
  },
  methods: {
    hideTypingStatus(data) {
      if (this.user.uniqueID === data.message.creator.uniqueID) return;
      if (
        !this.typingRecipients[data.channelID] ||
        !this.typingRecipients[data.channelID][data.message.creator.uniqueID]
      )
        return;
      clearTimeout(
        this.typingRecipients[data.channelID][data.message.creator.uniqueID]
          .timer
      );
      this.$delete(
        this.typingRecipients[data.channelID],
        data.message.creator.uniqueID
      );
    },
    async onFocus() {
      if (!this.$store.getters.currentChannelID) return;
      //dismiss notification on focus
      if (this.channel.server_id) {
        this.dismissServerNotification();
        return;
      }
      const find = this.$store.getters.notifications.find(notification => {
        return notification.channelID === this.$store.getters.currentChannelID;
      });
      if (find && find.count >= 1) {
        setTimeout(() => {
          this.$socket.client.emit("notification:dismiss", {
            channelID: this.$store.getters.currentChannelID
          });
        }, 500);
      }
    },
    dismissServerNotification() {
      if (this.hasNotifications) {
        this.$socket.client.emit("notification:dismiss", {
          channelID: this.channel.channelID
        });
      }
    },
    onTyping(data) {
      const { channel_id, user } = data;
      const typingRecipients = this.typingRecipients[channel_id];

      if (
        this.currentChannelID !== channel_id ||
        user.unique_id === this.user.uniqueID
      )
        return;
      if (typingRecipients === undefined) {
        this.$set(this.typingRecipients, channel_id, {
          [user.unique_id]: { username: user.username }
        });
      } else if (!typingRecipients[user.unique_id]) {
        this.$set(this.typingRecipients[channel_id], user.unique_id, {
          username: user.username
        });
      }

      clearTimeout(this.typingRecipients[channel_id][user.unique_id].timer);

      this.typingRecipients[channel_id][user.unique_id].timer = setTimeout(
        () => {
          this.$delete(this.typingRecipients[channel_id], user.unique_id);
        },
        3500
      );
    },
    async loadBotCommands() {
      if (!this.server) return;
      const botIds = this.serverBots
        .filter(b => !b.member.botCommands)
        .map(b => b.uniqueID);
      if (!botIds.length) return;
      const { result, ok } = await botsService.getCommands(botIds);
      if (ok) {
        for (let i = 0; i < result.data.length; i++) {
          const bot = result.data[i];
          this.$store.dispatch("members/updateMember", bot);
        }
      }
    }
  },
  mounted() {
    this.$socket.client.on("typingStatus", this.onTyping);

    bus.$on("newMessage", this.hideTypingStatus);
    window.addEventListener("focus", this.onFocus);
  },

  beforeDestroy() {
    bus.$off("newMessage", this.hideTypingStatus);
    window.removeEventListener("focus", this.onFocus);

    this.$socket.client.off("typingStatus", this.onTyping);
  },
  watch: {
    loadingMessages(val) {
      if (!val) {
        this.loadBotCommands();
      }
    }
  },
  computed: {
    hasNotifications() {
      return this.$store.getters
        .serverNotifications(this.channel.server_id)
        .find(c => c.channelID === this.channel.channelID);
    },
    loadingMessages() {
      return this.currentChannelID && !this.currentChannelMessages;
    },
    message: {
      get: function() {
        return this.$store.getters.message;
      },
      set: function(value) {
        this.$store.dispatch("setMessage", value);
      }
    },
    uploadQueue() {
      const allUploads = this.$store.getters.getAllUploads;
      const currentChannelID = this.$store.getters.currentChannelID;

      const filteredArray = [];

      for (let upload in allUploads) {
        if (allUploads[upload].channelID === currentChannelID) {
          filteredArray.push(allUploads[upload]);
        }
      }
      if (!filteredArray.length) return undefined;
      return filteredArray;
    },
    user() {
      return this.$store.getters.user;
    },
    channel() {
      return this.$store.getters.channels[this.currentChannelID];
    },
    server() {
      if (!this.channel) return false;
      if (!this.channel.server_id) return false;
      return (
        this.$store.getters["servers/servers"][this.channel.server_id] ||
        undefined
      );
    },
    serverBots() {
      return this.$store.getters["servers/serverMembers"].filter(
        sm => sm.server_id === this.server.server_id && sm.member.bot
      );
    },
    serverMember() {
      return this.$store.getters["servers/serverMembers"].find(
        sm =>
          sm.server_id === this.server.server_id &&
          sm.uniqueID === this.user.uniqueID
      );
    },
    myRolePermissions() {
      if (!this.serverMember) return undefined;
      const roles = this.$store.getters["servers/currentServerRoles"];
      if (!roles) return undefined;

      let perms = 0;

      if (this.serverMember.roles) {
        for (let index = 0; index < roles.length; index++) {
          const role = roles[index];
          if (this.serverMember.roles.includes(role.id)) {
            perms = perms | (role.permissions || 0);
          }
        }
      }

      const defaultRole = roles.find(r => r.default);
      perms = perms | defaultRole.permissions;
      return perms;
    },
    currentChannelMessages() {
      const currentChannelID = this.$store.getters.currentChannelID;
      return this.$store.getters.messages[currentChannelID];
    },
    currentChannelID() {
      return this.$store.getters.currentChannelID;
    },
    channelName() {
      return this.$store.getters.channelName;
    },
    recipients() {
      const currentChannel = this.$store.getters.currentChannelID;
      const channel = this.$store.getters.channels[currentChannel];
      return channel ? channel.recipients : undefined;
    },
    getWindowWidth() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight
      };
    },
    sendChannelMessagePermission() {
      if (this.type !== 1) return true;
      if (!this.channel) return null;

      if (!this.server) return false;

      if (this.server.creator.uniqueID === this.user.uniqueID) return true;
      if (!this.channel.permissions) return true;
      if (this.channel.permissions.send_message === undefined) return true;
      return this.channel.permissions.send_message;
    },
    hasAdminRole() {
      return !!containsPerm(
        this.myRolePermissions || 0,
        permissions.ADMIN.value
      );
    },
    roleSendMessagePermission() {
      if (this.type !== 1) return true;
      if (!this.channel) return null;

      if (!this.server) return false;
      return (
        !!containsPerm(
          this.myRolePermissions || 0,
          permissions.SEND_MESSAGES.value
        ) || this.hasAdminRole
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.no-channel-selected {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-content: center;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  .message {
    margin-top: 20px;
    text-align: center;
  }
  .material-icons {
    font-size: 50px;
  }
}

.hidden {
  display: none;
}

.error-info {
  color: red;
}

.right-panel {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.message-logs {
  flex: 1;
  position: relative;
}

.loading {
  overflow: auto;
  flex: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.no-message-permission {
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  background: #1f2329;
  color: white;
  text-align: center;
  padding: 5px;
  min-height: 50px;
  justify-content: center;
  user-select: none;
  display: flex;
  align-items: center;
  align-content: center;
  cursor: default;
}
</style>
