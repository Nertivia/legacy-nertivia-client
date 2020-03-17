<template>
  <div class="channels-list">
    <spinner v-if="channels === undefined" size="40" />
    <div v-if="channels" class="wrapper">
      <draggable
        :disabled="!canManageChannels"
        v-model="serverChannels"
        :animation="200"
        :delay="mobile ? 400 : 0"
        ghost-class="ghost"
        @end="onEnd"
        @start="onStart"
      >
        <ChannelTemplate
          v-for="channel in serverChannels"
          :key="channel.channelID"
          :channel-data="channel"
          @click.native="openChannel(channel)"
          @contextmenu.prevent.native="contextEvent($event, channel)"
        />
      </draggable>
    </div>
  </div>
</template>
<script>
import Spinner from "@/components/Spinner.vue";
import ChannelTemplate from "@/components/app/ServerTemplate/ChannelTemplate.vue";
import ServerService from "@/services/ServerService.js";
import draggable from "vuedraggable";
import { isMobile } from "@/utils/Mobile";
import { bus } from "@/main.js";
import { permissions, containsPerm } from "@/utils/RolePermissions";
export default {
  components: { draggable, ChannelTemplate, Spinner },
  props: ["serverID"],
  data() {
    return {
      mobile: isMobile(),
      drag: false
    };
  },

  methods: {
    onStart() {
      this.drag = true;
    },
    async onEnd() {
      this.drag = false;
      const channelIDs = this.serverChannels.map(s => s.channelID);
      await ServerService.channelPosition(this.serverID, channelIDs);
    },
    openChannel(channel) {
      // add to local storage
      const selectedChannels = JSON.parse(
        localStorage.getItem("selectedChannels") || "{}"
      );
      selectedChannels[this.serverID] = channel.channelID;
      localStorage.setItem(
        "selectedChannels",
        JSON.stringify(selectedChannels)
      );
      bus.$emit("closeLeftMenu");
      this.$store.dispatch("openChannel", channel);
      this.$store.dispatch("selectedChannelID", channel.channelID);
    },
    contextEvent(event, channel) {
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "CHANNEL_CONTEXT",
        serverID: channel.server_id,
        channelID: channel.channelID,
        x: event.clientX,
        y: event.clientY
      });
    },
  },
  async beforeMount() {
    if (this.channels !== undefined) return;
    const { ok, error, result } = await ServerService.getChannels(
      this.serverID
    );
    if (!ok) {
      console.log(error);
    } else {
      const channelsIDs = [];
      for (let index = 0; index < result.data.length; index++) {
        const element = result.data[index];
        element.server = undefined;
        element.server_id = this.serverID;
        this.$store.dispatch("channel", element);
        channelsIDs.push(element.channelID);
      }
      this.$store.dispatch("servers/AddChannelsIDs", {
        serverID: this.serverID,
        channelsIDs: channelsIDs
      });
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    serverMember() {
      return this.$store.getters["servers/serverMembers"].find(
        sm =>
          sm.server_id === this.serverID && sm.uniqueID === this.user.uniqueID
      );
    },
    myRolePermissions() {
      if (!this.serverMember) return undefined;
      const roles = this.$store.getters["servers/roles"][this.serverID];
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
    canManageChannels() {
      const isServerOwner =
        this.$store.getters["servers/servers"][this.serverID].creator
          .uniqueID === this.user.uniqueID;

      return (
        isServerOwner ||
        containsPerm(
          this.myRolePermissions,
          permissions.ADMIN.value | permissions.MANAGE_CHANNELS.value
        )
      );
    },
    channels() {
      return this.$store.getters.channels;
    },
    serverChannels: {
      get() {
        const channelsIds = this.$store.getters["servers/channelsIDs"][
          this.serverID
        ];
        if (!channelsIds) {
          return false;
        }
        return channelsIds
          .map(id => this.channels[id])
          .filter(c => c.server_id === this.serverID);
      },
      set(value) {
        this.$store.dispatch("servers/setChannelIDs", {
          serverID: this.serverID,
          channelIDs: value.map(c => c.channelID)
        });
      }
    }
  }
};
</script>

<style scoped>
.ghost {
  opacity: 0;
}

.channels-list {
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  flex-direction: column;
}

/* ------- SCROLL BAR -------*/
/* width */
.channels-list::-webkit-scrollbar {
  width: 3px;
}
</style>
