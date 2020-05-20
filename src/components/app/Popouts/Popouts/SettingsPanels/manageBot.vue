<template>
  <div class="inner-panel">
    <error-list v-if="errors" :errors="errors" />
    <div class="content" :key="key">
      <div class="avatar-box">
        <profile-picture
          :uniqueID="bot.uniqueID"
          :url="update.avatar"
          :avatar="update.avatar ? null : bot.avatar"
          size="80px"
          :hover="true"
          animation-padding="4px"
        />
        <div class="button" @click="$refs.avatarBrowser.click()">Change Avatar</div>
        <input ref="avatarBrowser" @change="avatarChangeEvent" type="file" accept=".jpeg, .jpg, .png, .gif" class="hidden" />
      </div>
      <div class="outer-input">
        <div class="title">Username</div>
        <div class="user-tag">
          <input
            :default-value.prop="bot.username"
            @input="inputEvent('username', $event)"
            type="text"
            class="username"
          />

          <input
            :default-value.prop="bot.tag"
            @input="inputEvent('tag', $event)"
            type="text"
            class="tag"
          />
        </div>
      </div>
      <div class="invite-link">
        <div class="sub-title">Bot Invite Link:</div>
        <div class="link">
          <a
            :href="`https://nertivia.tk/bots/${this.bot.uniqueID}?perms=${perms}`"
            target="_blank"
          >{{`https://nertivia.tk/bots/${this.bot.uniqueID}?perms=${perms}`}}</a>
        </div>
        <div class="sub-title">Permissions:</div>
        <div class="perms-list">
          <div
            class="perms-check-box"
            v-for="perm in permsList"
            :key="perm.value"
            @click="togglePermission(perm)"
          >
            <div class="box" :class="{checked: perm.enabled}" />
            <div class="name">{{perm.name}}</div>
          </div>
        </div>
      </div>
      <div class="token">
        <div
          class="reveal-link"
          @click="showToken = !showToken"
        >{{showToken ? 'Hide Token' : 'Show Token'}}</div>
        <input class="token-inner" v-if="showToken" :value="token" readonly="readonly" />
        <div class="copy-token-button" @click="copyToken">Copy</div>
        <div class="copy-token-button" @click="resetToken">Reset Token</div>
      </div>
      <div class="button" @click="showMore = !showMore">Show More Options</div>
      <div class="more-options" v-if="showMore">
        <div class="button" @click="deleteButton">{{deleteSure ? 'Are you sure?' : 'Delete Bot'}}</div>
      </div>
    </div>
    <div class="buttons">
      <div class="button" @click="$emit('back')">Back</div>
      <div class="button" @click="saveButton">{{saving ? 'Saving...' : 'Save'}}</div>
    </div>
  </div>
</template>



<script>
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import botsService from "../../../../../services/botsService";
import ErrorList from "@/components/app/errorsListTemplate";
import path from "path";

import {
  permissions,
  containsPerm,
  removePerm,
  addPerm
} from "@/utils/RolePermissions";
export default {
  props: ["bot"],
  components: { ProfilePicture, ErrorList },
  data() {
    return {
      showToken: false,
      token: "Loading...",
      showMore: false,
      deleteSure: false,
      perms: permissions.SEND_MESSAGES.value,
      update: {},
      errors: null,
      key: 0,
      saving: false,
    };
  },
  async mounted() {
    const { result, ok } = await botsService.getBot(this.bot.uniqueID, true);
    if (ok) {
      this.token = result.data.token;
    }
  },
  watch: {
    showMore() {
      this.deleteSure = false;
    }
  },
  methods: {
    copyToken() {
      this.$clipboard(this.token);
      alert("Token copied to clipboard.");
    },
    async resetToken() {
      const { ok, result } = await botsService.resetToken(this.bot.uniqueID);
      if (ok) {
        this.token = result.data.token
      }
    },
    deleteButton() {
      if (!this.deleteSure) {
        this.deleteSure = true;
        return;
      }
    },
    togglePermission(perm) {
      if (perm.enabled) {
        this.perms = removePerm(this.perms, perm.value);
      } else {
        this.perms = addPerm(this.perms, perm.value);
      }
    },
    async saveButton() {
      if (this.saving) return;
      this.saving = true;
      this.errors = null;
      const { ok, result, error } = await botsService.updateBot(
        this.update,
        this.bot.uniqueID
      );
      if (ok) {
        this.$emit("update", result.data)    
        this.update = {}
        this.key = Math.random();
      } else {
        if (error.response === undefined) {
          this.errors = { message: "Cant connect to server" };
          return;
        }
        const data = error.response.data;
        if (data.message) {
          this.errors = [{ msg: data.message }];
          return;
        }
        this.errors = data.errors;
      }
      this.saving = false;
    },
    inputEvent(name, event) {
      this.$set(this.update, name, event.target.value);
    },
    avatarChangeEvent(event) {
      const file = event.target.files[0];
      const _this = this;
      const maxSize = 8092000;
      if (file.size > maxSize) {
        return this.$store.dispatch(
          "setGenericMessage",
          "Image is larger than 8MB"
        );
      }
      event.target.value = "";
      const allowedFormats = [".png", ".jpeg", ".gif", ".jpg"];
      if (!allowedFormats.includes(path.extname(file.name).toLowerCase())) {
        return this.$store.dispatch(
          "setGenericMessage",
          "That file format is not allowed!"
        );
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function() {
        _this.$set(_this.update, "avatar", reader.result);
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
        return this.$store.dispatch(
          "setGenericMessage",
          "Something went wrong. Try again later."
        );
      };
    }
  },
  computed: {
    permsList() {
      const permsArr = [];
      const permValues = Object.values(permissions);
      for (let index = 0; index < permValues.length; index++) {
        const perm = permValues[index];
        permsArr.push({
          name: perm.name,
          value: perm.value,
          enabled: containsPerm(this.perms, perm.value)
        });
      }
      return permsArr;
    }
  }
};
</script>

<style scoped lang="scss">
.inner-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  overflow: hidden;
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  overflow: auto;
  padding-top: 20px;
}
.title.main {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 10px;
}
.button {
  background: rgba(0, 0, 0, 0.2);
  align-self: center;
  padding: 5px;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}
.avatar-box {
  align-self: center;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.4);
  width: 150px;
  padding: 20px;
  margin-top: 10px;
  border-radius: 4px;
  align-items: center;
  align-content: center;
  .button {
    margin-top: 10px;
    background: rgba(0, 0, 0, 0.2);
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
.hidden {
  display: none;
}
.outer-input {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10px;
  margin: 10px;
  align-self: center;
  flex-shrink: 0;
  border-radius: 4px;
  .title {
    font-size: 14px;
    margin-left: 2px;
  }
}
.outer-input .user-tag .username {
  flex: 1;
}
.outer-input .user-tag .tag {
  border-left: solid 1px rgb(168, 168, 168);
  width: 50px;
}
.outer-input .user-tag {
  display: flex;
  overflow: hidden;
}
.outer-input input {
  width: initial;
  border-radius: 4px;
}
.buttons {
  display: flex;
  margin-top: auto;
  .button {
    padding: 10px;
  }
  .button:nth-child(1) {
    margin-left: 10px;
  }
  .button:nth-child(2) {
    margin-left: auto;
    margin-right: 10px;
  }
}
.token {
  display: flex;
  height: 40px;
  align-content: center;
  align-items: center;

  .reveal-link {
    cursor: pointer;
    display: flex;
    user-select: none;
    align-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    height: 100%;
    font-size: 13px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 4px;
    margin-left: 3px;
    margin-right: 3px;
  }
  align-self: center;
  text-align: center;
  line-break: anywhere;
  margin: 10px;
  .token-inner {
    background: rgba(0, 0, 0, 0.3);
    font-size: 13px;
    height: 40px;
    padding: 0;
    overflow: hidden;
    border-radius: 4px;
    margin: 0;
    padding-left: 5px;
    padding-right: 5px;
  }
  .copy-token-button {
    cursor: pointer;
    display: flex;
    user-select: none;
    align-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    font-size: 13px;
    height: 100%;
    overflow: hidden;
    border-radius: 4px;
    padding-left: 5px;
    padding-right: 5px;
    margin-left: 3px;
    margin-right: 3px;
  }
}
.invite-link {
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 4px;
  width: 260px;
  word-break: break-all;
  align-self: center;
  .sub-title {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .link {
    padding: 5px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
  a {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    &:hover {
      color: white;
    }
  }
}

.more-options {
  align-self: center;
  margin-top: 20px;
}
.perms-list {
  .perms-check-box {
    display: flex;
    align-items: center;
    align-content: center;
    padding: 5px;
    .box {
      background: gray;
      height: 20px;
      width: 20px;
      border-radius: 4px;
      margin-right: 5px;
      cursor: pointer;
      &.checked {
        background: rgb(0, 153, 255);
      }
    }
  }
}

// <div class="perms-list">
//   <div class="perms-check-box" v-for="perm in permsList" :key="perm.value">
//     <div class="box" :class="{checked: perm.enabled}" />
//     <div class="name">{{perm.name}}</div>
//   </div>
// </div>
</style>
