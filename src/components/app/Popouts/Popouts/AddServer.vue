<template>
  <div class="dark-background add-server-popout" @mousedown="backgroundClick">
    <div class="inner">
      <div class="tabs">
        <div
          :class="{ tab: true, selected: tab == 0 }"
          @click="
            tab = 0;
            slideBack();
          "
        >
          {{$t('create')}}
        </div>
        <div
          :class="{ tab: true, selected: tab == 1 || tab == 2 }"
          @click="
            tab = 1;
            slideForward();
          "
        >
          Join
        </div>
      </div>
      <transition-group tag="div" class="slider" :name="slideInDirection">
        <div class="content" v-if="tab == 0" key="add-server">
          <errors-list-template :errors="errors" v-if="errors" />

          <div class="inner-content">
            <div class="add-server">
              <profile-picture
                class="avatar"
                size="90px"
                :avatar="undefined"
              />
              <div class="input">
                <div class="input-name">Server Name</div>
                <input
                  v-model="serverName"
                  type="text"
                  placeholder="Server Name"
                />
              </div>
              <span v-if="serverNameError" class="warn">{{
                serverNameError
              }}</span>
              <div class="button create-button" @click="createButton">
                {{$t('create')}}
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab == 1" key="check-invite" class="content">
          <i class="material-icons icon">forum</i>
          <div class="title">Join A Server</div>
          <div class="input">
            <div class="input-name">
              Invite Code
              <span v-if="inviteCodeError" class="warn"
                >- {{ inviteCodeError }}</span
              >
            </div>
            <input v-model="inviteCode" type="text" placeholder="Invite code" />
          </div>
          <div class="button check-button" @click="checkInviteCode">Check</div>
        </div>
        <div v-if="tab == 2" key="join-server" class="content server">
          <profile-picture
            class="avatar found"
            size="100px"
            :hover="true"
            :uniqueID="server.server_id"
            :avatar="server.avatar"
          />
          <div class="server-name">{{ server.name }}</div>
          <div class="buttons">
            <div
              v-if="!servers[server.server_id]"
              class="button join-button"
              @click="joinButton"
            >
              {{$t('join')}}
            </div>
            <div
              v-if="servers[server.server_id]"
              class="button join-button button-clicked"
            >
              {{$t('joined')}}
            </div>
            <div
              class="button cancel-button"
              @click="
                server = null;
                inviteCode = '';
                tab = 1;
                slideBack();
              "
            >
              Cancel
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>


import ServerService from "@/services/ServerService";
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";

export default {
  components: { ProfilePicture, ErrorsListTemplate },
  data() {
    return {
      tab: 0,
      serverName: "",
      serverNameError: null,
      inviteCode: "",
      inviteCodeError: null,
      server: null,
      slideInDirection: "slide-forward",
      errors: null
    };
  },
  computed: {
    servers() {
      return this.$store.getters["servers/servers"];
    }
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "addServer",
        visibility: false
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    slideForward() {
      this.slideInDirection = "slide-forward";
    },
    slideBack() {
      this.slideInDirection = "slide-back";
    },
    async createButton(event) {
      if (event.target.classList.contains("button-clicked")) return;
      this.errors = null;
      const name = this.serverName.trim();
      if (!name) {
        this.errors = [{ msg: "Enter a name!" }];
        return;
      }
      event.target.classList.add("button-clicked");
      const { ok, error } = await ServerService.post({ name });
      if (ok) {
        this.closeMenu();
      } else {
        if (error.response) {
          if (error.response.data.message)
            this.errors = [{ msg: error.response.data.message }];
          else this.errors = error.response.data.errors;
        } else {
          this.errors = [{ msg: "Something went wrong." }];
        }
        event.target.classList.remove("button-clicked");
      }
    },
    async checkInviteCode(event) {
      if (event.target.classList.contains("button-clicked")) return;
      this.inviteCodeError = null;
      const inviteCode = this.inviteCode.trim();
      if (!inviteCode) {
        this.inviteCodeError = "Enter invite code!";
        return;
      }
      event.target.classList.add("button-clicked");

      let code;
      if (inviteCode.split("/").length >= 2) {
        code = inviteCode.split("/").pop();
      } else {
        code = inviteCode;
      }
      const { ok, error, result } = await ServerService.getInviteDetail(code);

      if (!ok) {
        event.target.classList.remove("button-clicked");
        return (this.inviteCodeError = error.response.data.message);
      }
      event.target.classList.remove("button-clicked");
      this.slideForward();
      this.server = result.data;
      this.tab = 2;
    },
    async joinButton(event) {
      if (event.target.classList.contains("button-clicked")) return;
      event.target.classList.add("button-clicked");
      let code;
      if (this.inviteCode.split("/").length >= 2) {
        code = this.inviteCode.split("/").pop();
      } else {
        code = this.inviteCode;
      }
      const { ok } = await ServerService.joinServer(code, {
        socketID: this.$socket.client.id
      });
      if (ok) {
        this.closeMenu();
      }
    }
  }
};
</script>

<style scoped>
.slide-forward-enter-active,
.slide-forward-leave-active {
  transition: 0.3s;
}
.slide-forward-enter {
  transform: translate(100%, 0);
}
.slide-forward-leave-to {
  transform: translate(-100%, 0);
}

.slide-back-enter-active,
.slide-back-leave-active {
  transition: 0.3s;
}
.slide-back-enter {
  transform: translate(-100%, 0);
}
.slide-back-leave-to {
  transform: translate(100%, 0);
}

.slider {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
}

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
  height: 100%;
  max-height: 450px;
  width: 400px;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: linear-gradient(
    to bottom,
    rgba(0, 87, 153, 0.8) 0,
    rgba(0, 118, 209, 0.8)
  );
  border-radius: 4px;
  backdrop-filter: blur(5px);
}
.tabs {
  display: flex;
  justify-content: center;
  padding-top: 15px;
  background: rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}
.tab {
  flex-shrink: 0;
  border-radius: 1px;
  padding: 5px;
  padding-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
  border-bottom: solid 5px rgba(255, 255, 255, 0);
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 20px;
}
.selected {
  border-bottom: solid 5px white !important;
}
.tab:hover {
  border-bottom: solid 5px rgba(255, 255, 255, 0.4);
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  align-items: center;
  overflow: auto;
}
.inner-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-content: center;
}
.add-server {
  display: flex;
  flex-direction: column;
  margin: auto;
}
.errors {
  margin-top: 10px;
  flex-shrink: 0;
}

.input {
  align-self: center;
  margin-top: 15px;
  margin-bottom: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 4px;
}
.input input {
  border-radius: 4px;
}

.title {
  text-align: center;
  margin: 20px;
  user-select: none;
}

.avatar {
  align-self: center;
  margin-bottom: 10px;
}

.button {
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.2);
  user-select: none;
  border: none;
  color: white;
  font-size: 17px;
  outline: none;
  transition: 0.2s;
  align-self: center;
  margin: 5px;
  cursor: pointer;
  border-radius: 4px;
}
.button:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.button-clicked {
  background: rgb(126, 126, 126) !important;
}

.create-button {
  padding: 10px;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
  user-select: none;
}

.check-button {
  padding: 10px;
}
.warn {
  color: red;
}

.server-name {
  text-align: center;
  font-size: 25px;
  margin-bottom: 40px;
}

.server .buttons {
  display: flex;
  justify-items: center;
  align-content: center;
}
.server .button {
  margin: auto;
  padding: 10px;
  align-self: center;
  justify-content: center;
}

.join-button {
  margin-right: 5px !important;
}

.cancel-button {
  margin-right: 5px !important;
  background: rgba(245, 49, 49, 0.856);
}

.cancel-button:hover {
  background: rgb(238, 55, 55);
}

.icon {
  font-size: 80px;
  margin-top: 40px;
  margin-bottom: 5px;
}
.found {
  margin-top: 70px;
}
</style>
