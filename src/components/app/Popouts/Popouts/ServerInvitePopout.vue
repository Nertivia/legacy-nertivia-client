<template>
  <div
    class="dark-background"
    @mousedown="backgroundClick"
  >
    <div class="inner">
      <div class="top">
        <div
          class="button"
          @click="createInviteButton"
        >
          Create New Invite
        </div>
      </div>
      <div class="bottom">
        <div class="title">
          Invites created by you:
        </div>
        <spinner v-if="invites === null" />
        <div
          v-if="invites !== null"
          class="invite-list"
        >
          <div
            v-for="invite in invites.slice().reverse()"
            :key="invite"
            class="invite"
          >
            {{ invite }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import Spinner from "@/components/Spinner.vue";
import ServerService from "@/services/ServerService";

export default {
  components: {Spinner},
  data() {
    return {
      invites: null
    };
  },
  async mounted() {
    // get invites created by you
    const {ok, error, result} = await ServerService.getInvites(this.serverID);
    if (ok) {
      let invites = [];
      for (let invite of result.data) {
        invites.push(invite.invite_code)
      } 
      this.invites = invites;
    }
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "showServerInviteMenu",
        visibility: false
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    async createInviteButton() {
      if (!this.serverID) {
        console.log("Server ID is not defined");
        return;
      }
      const {ok, error, result} = await ServerService.postInvite(this.serverID);
      if (ok) {
        this.invites.push(result.data.invite_code)
      }

    }
  },
  computed: {
    serverID() {
      return this.$store.getters.popouts.allPopout.serverID
    },
  }
};
</script>


<style scoped>
.dark-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.541);
  z-index: 111111;
  display: flex;
}
.inner {
  margin: auto;
  height: 400px;
  width: 400px;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: linear-gradient(#0B4155, #01677E);
  border-radius: 4px;
}
.top {
  display: flex;
  width: 100%;
  min-height: 100px;
  background: rgba(0, 0, 0, 0.171);
  flex-shrink: 0;
}

.button {
  padding: 10px;
  background: #062c3a;
  margin: auto;
  transition: 0.3s;
  user-select: none;
  cursor:pointer;
}
.button:hover {
  background: #041e27;
}

.bottom {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.title {
  margin: 10px;
  user-select: none;
}
.invite-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  height: 100%;
}
.invite {
  display: flex;
  background: rgba(0, 0, 0, 0.274);
  margin: 5px;
  padding: 10px;
}
</style>

