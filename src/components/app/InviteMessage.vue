<template>
  <div class="invite-content">
    <img
      class="avatar"
      v-if="inviteDetail"
      :src="avatarDomain + inviteDetail.avatar"
      alt=""
    />
    <div class="name" v-if="inviteDetail === undefined">
      Getting Invite Details...
    </div>
    <div class="name" v-if="inviteDetail === null">Invalid Invite</div>
    <div class="info" v-if="inviteDetail">
      <div class="name">{{ inviteDetail.name }}</div>
      <div class="button" v-if="joinedServer" @click="visitServer">Visit</div>
      <div class="button" v-else @click="joinServer">Join</div>
    </div>
  </div>
</template>

<script>
import ServerService from "@/services/ServerService";
import config from "../../config";
import { bus } from "../../main";

export default {
  props: ["invite"],
  data() {
    return {
      avatarDomain: config.nertiviaCDN,
      inviteDetail: undefined
    };
  },
  methods: {
    async joinServer() {
      await ServerService.joinServer(this.invite[1], {
        socketID: this.$socket.client.id
      });
    },
    visitServer() {
      bus.$emit("openServer", this.inviteDetail.server_id);
    }
  },
  async mounted() {
    const code = this.invite[1];
    const { ok, result } = await ServerService.getInviteDetail(code);
    if (!ok) {
      this.inviteDetail = null;
    } else {
      this.inviteDetail = result.data;
    }
  },
  computed: {
    joinedServer() {
      if (!this.inviteDetail) return;
      return this.$store.getters["servers/servers"][
        this.inviteDetail.server_id
      ];
    }
  }
};
</script>

<style scoped lang="scss">
.invite-content {
  display: flex;
  background: #ffffff21;
  padding: 10px;
  max-width: 200px;
  margin-top: 5px;
  align-items: center;
  align-content: center;
  height: 50px;
}

.invite-content .material-icons {
  font-size: 40px;
}
.avatar {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.info {
  margin-left: 10px;
}
.button {
  background: rgba(0, 0, 0, 0.2);
  padding: 3px;
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s;
  margin-top: 5px;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
