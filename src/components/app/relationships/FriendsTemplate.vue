<template>
  <div class="friend">
    <div
      class="wrapper"
      :class="{ selected: uniqueIDSelected }"
      @click="openChat"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div
        class="profile-picture"
        :style="`border-color: ${status.statusColor};`"
        @click="openUserInformation"
      >
        <profile-picture
          class="avatar"
          :id="recipient.id"
          :avatar="recipient.avatar"
          animationPadding="0"
          :hover="hover"
          size="30px"
        />
        <div
          class="status"
          :style="`background-image: url(${status.statusURL})`"
        />
      </div>
      <div class="information">
        <div class="username">{{ recipient.username }}</div>
        <div class="status-name">{{ status.statusName }}</div>
        <div
          v-if="programActivityStatus && status.status"
          class="custom-status program"
          :title="
            `${programActivityStatus.status} ${programActivityStatus.name}`
          "
        >
          <span class="icon material-icons">widgets</span>
          <strong>{{ programActivityStatus.status }}</strong>
          <span>{{ programActivityStatus.name }}</span>
        </div>
        <Markup
          v-else-if="customStatus && status.status"
          class="custom-status"
          :text="customStatus"
        />
      </div>
      <div v-if="notifications && notifications > 0" class="notification">
        <div class="notification-inner">{{ notifications }}</div>
      </div>
      <div
        v-else-if="recents"
        class="material-icons close-button"
        @click="closeChannel"
      >
        close
      </div>
    </div>
  </div>
</template>

<script>
import channelService from "@/services/channelService";
import Markup from "@/components/app/Markup.vue";
import ProfilePicture from "@/components/global/ProfilePictureTemplate";
import statuses from "@/utils/statuses";
import { bus } from "@/main";
import config from "@/config";

export default {
  props: ["friend", "recents", "recipient"],
  components: { Markup, ProfilePicture },
  data() {
    return {
      hover: false
    };
  },
  computed: {
    notifications() {
      const channels = this.$store.getters.channels;
      const recipient = this.recipient;

      const notifications = this.$store.getters.notifications.find(function(e) {
        const channel = channels[e.channelID];
        if (channel && channel.server_id) return;
        return e.sender.id === recipient.id;
      });

      let isSelectedUser = false;
      if (this.friend.recipient) {
        isSelectedUser =
          this.friend.recipient.id ===
          this.$store.getters.selectedUserUniqueID;
      } else {
        isSelectedUser =
          this.friend.recipients[0].id ===
          this.$store.getters.selectedUserUniqueID;
      }

      if (!notifications) return;

      if (isSelectedUser && document.hasFocus()) return;
      return notifications.count;
    },
    userAvatar() {
      return config.nertiviaCDN + this.recipient.avatar;
    },
    customStatus() {
      return this.$store.getters["members/customStatusArr"][
        this.recipient.id
      ];
    },
    programActivityStatus() {
      const programActivityJson = this.$store.getters[
        "members/programActivity"
      ];
      return programActivityJson[this.recipient.id];
    },
    status() {
      const presences = this.$store.getters["members/presences"];
      let status = 0;
      if (presences[this.recipient.id]) {
        status = presences[this.recipient.id] || 0;
      }

      return {
        status: parseInt(status),
        statusName: statuses[parseInt(status)].name,
        statusURL: statuses[parseInt(status)].url,
        statusColor: statuses[parseInt(status)].color,
        bgColor: statuses[parseInt(status)].bgColor
      };
    },
    uniqueIDSelected() {
      return (
        this.$store.getters.selectedUserUniqueID === this.recipient.id
      );
    }
  },
  methods: {
    async closeChannel() {
      await channelService.delete(this.friend.channelID);
    },
    async openChat(event) {
      if (
        event.target.closest(".profile-picture") ||
        event.target.closest(".close-button")
      )
        return;
      bus.$emit("closeLeftMenu");
      this.$store.dispatch("openChat", {
        id: this.recipient.id,
        channelID: this.friend.channelID,
        channelName: this.recipient.username
      });
    },
    openUserInformation() {
      this.$store.dispatch("setUserInformationPopout", this.recipient.id);
    }
  }
};
</script>

<style scoped lang="scss">
.username {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.friend {
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 100%;
}
.friend .wrapper {
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  height: 45px;
  width: 100%;
  transition: 0.3s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  padding-left: 10px;
  margin-left: 3px;
  margin-right: 3px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.selected {
    background: linear-gradient(
      137deg,
      rgba(45, 136, 255, 1) 0%,
      rgba(87, 160, 255, 1) 100%
    );
    color: white;
  }

  &:hover .status-name {
    opacity: 1;
    height: 13px;
  }
  &:hover .custom-status {
    opacity: 0;
    height: 0;
  }

  &:hover .close-button {
    opacity: 1;
  }
  &:hover .status {
    opacity: 1;
    bottom: -4px;
  }
}

.profile-picture {
  height: 30px;
  width: 30px;
  background-color: rgba(0, 0, 0, 0.425);
  border-radius: 50%;
  margin: auto;
  margin-left: 2px;
  margin-right: 5px;
  border: solid 2px;
  position: relative;
  transition: 0.3s;
  flex-shrink: 0;
  box-shadow: 0px 0px 4px 0px black;
}
.avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  object-fit: cover;
}
.information {
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
  flex: 1;
}

.notification {
  position: absolute;
  display: flex;
  background: #ee3e34;
  height: 100%;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50px;
  border-radius: 1px;
}
.notification-inner {
  margin: auto;
}

.status {
  position: absolute;
  height: 15px;
  width: 15px;
  background-color: black;
  border-radius: 50%;
  background-size: calc(100% + 2px);
  background-position: center;
  bottom: -10px;
  right: -5px;
  opacity: 0;
  transition: 0.3s;
}

.custom-status {
  transition: 0.3s;
  height: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  align-items: center;
  align-content: center;
  white-space: pre;
  overflow: hidden;
  width: 170px;
  text-overflow: ellipsis;
}
.custom-status.program strong {
  margin-right: 3px;
}
.custom-status.program .icon {
  font-size: 14px;
  vertical-align: -2px;
  color: white;
  margin-right: 3px;
}

.status-name {
  opacity: 0;
  font-size: 13px;
  transition: 0.3s;
  color: #b7cbce;
  height: 0;
}

.close-button {
  display: flex;
  flex-shrink: 0;
  height: 100%;
  opacity: 0;
  align-self: center;
  color: rgb(207, 207, 207);
  transition: 0.2s;
  font-size: 22px;
  margin-right: 15px;
  align-content: center;
  align-items: center;
}
.close-button:hover {
  color: white;
}
</style>

<style>
.custom-status .emoji {
  height: 14px;
  width: 14px;
  vertical-align: -3px;
}
</style>
