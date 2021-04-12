<template>
  <div class="inner-content">
    <div class="bottom">
      <div
        class="custom-links"
        :class="{ notAllowed: !server.verified }"
        v-if="invites !== null && checkServerCreator"
      >
        <div class="title">Create custom link (Verified servers only)</div>
        <div class="custom-link-input">
          <div class="link" @click="$refs.customLinkInput.focus()">
            https://nertivia.net/i/
          </div>
          <input
            ref="customLinkInput"
            v-model="customLink"
            @blur="updateCustomLink"
            @keydown="keyDownEvent"
            spellcheck="false"
            type="text"
            placeholder="Type here"
          />
        </div>
      </div>

      <div class="strip">
        <div class="button" @click="createInviteButton">
          <div class="material-icons">add</div>
          Create New Invite
        </div>
      </div>
      <spinner v-if="invites === null" />
      <div v-if="invites !== null" class="invite-list">
        <div v-for="invite in invites" :key="invite.invite_code" class="invite">
          <div class="details">
            <div class="full-link">
              <span class="link">https://nertivia.net/i/</span>
              <span>{{ invite.invite_code }}</span>
              <div class="other-info">
                <span class="sub-title">Created By:</span>
                <span
                  class="username"
                  @click="showUser(invite.creator.id)"
                  >{{ invite.creator.username }}:{{ invite.creator.tag }}</span
                >
                <span class="sub-title">Uses:</span>
                {{ invite.uses }}
              </div>
            </div>
          </div>
          <div class="buttons">
            <div class="copy-button" @click="copy(invite)">Copy</div>
            <div class="copy-button delete" @click="deleteInvite(invite)">
              Delete
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/global/Spinner.vue";
import ServerService from "@/services/ServerService";

export default {
  components: { Spinner },
  data() {
    return {
      invites: null,
      customLink: ""
    };
  },
  async mounted() {
    // get invites created by you
    const { ok, result } = await ServerService.getInvites(this.serverID);
    if (ok) {
      this.invites = result.data.reverse();
    }
  },
  methods: {
    showUser(id) {
      this.$store.dispatch("setUserInformationPopout", id);
    },
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
      const { ok, result } = await ServerService.postInvite(this.serverID);
      if (ok) {
        this.invites = [
          { invite_code: result.data.invite_code, creator: this.user },
          ...this.invites
        ];
      }
    },
    copy(invite) {
      this.$clipboard("https://nertivia.net/i/" + invite.invite_code);
    },
    async deleteInvite(invite) {
      this.invites = this.invites.filter(
        i => i.invite_code !== invite.invite_code
      );
      await ServerService.deleteInvite(invite.invite_code);
    },
    async updateCustomLink() {
      const { ok, error } = await ServerService.createCustomInvite(
        this.serverID,
        this.customLink
      );
      if (ok) {
        if (this.customInvite) {
          const index = this.invites.findIndex(i => i.custom);
          this.$set(this.invites, index, {
            ...this.customInvite,
            invite_code: this.customLink
          });
        } else {
          this.invites = [
            { invite_code: this.customLink, creator: this.user, custom: true },
            ...this.invites
          ];
        }
      } else {
        this.$store.dispatch("setGenericMessage", error.response.data.message);
      }
    },
    keyDownEvent(e) {
      if (e.key === "Enter") {
        this.updateCustomLink();
      }
    }
  },
  watch: {
    customInvite(val) {
      this.customLink = val ? val.invite_code : "";
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    serverID() {
      return this.$store.getters.popouts.allPopout.serverID;
    },
    server() {
      return this.$store.getters["servers/servers"][this.serverID];
    },
    checkServerCreator() {
      return this.server.creator.id === this.user.id;
    },
    customInvite() {
      if (!this.invites) return undefined;
      return this.invites.find(i => i.custom);
    }
  }
};
</script>

<style scoped lang="scss">
.inner-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
}
.strip {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
}

.button {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
}
.button:hover {
  background: rgba(255, 255, 255, 0.2);
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
  margin-left: 0;
  margin-right: 0;
  padding: 5px;
  transition: 0.2s;
}

.invite:hover {
  background: rgba(255, 255, 255, 0.2);

  .copy-button {
    opacity: 0.7;
  }
  .copy-button:hover {
    opacity: 1;
  }
}
.link {
  color: rgba(255, 255, 255, 0.7);
  word-break: break-word;
}

.other-info {
  margin-top: 5px;
}

.buttons {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-right: 0;
}

.details {
  display: flex;
  align-items: center;
}

.copy-button {
  flex-shrink: 0;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
  user-select: none;
}
.copy-button.delete {
  margin-top: 10px;
  color: rgb(255, 152, 67);
}
.other-info {
  font-size: 14px;
}
.sub-title {
  opacity: 0.8;
  margin-left: 5px;
  margin-right: 5px;
  &:first-child {
    margin-left: 0;
  }
}
.username {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.custom-links {
  display: flex;
  flex-direction: column;
  position: relative;
  &.notAllowed {
    &::before {
      content: "";
      position: absolute;
      cursor: not-allowed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    opacity: 0.4;
  }
}
.custom-link-input {
  border-radius: 4px;
  padding-left: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  align-self: center;
  margin-bottom: 10px;
  align-content: center;
  font-size: 14px;
  input {
    margin: 0;
    background: transparent;
    padding-left: 0;
    width: initial;
  }
}
</style>
