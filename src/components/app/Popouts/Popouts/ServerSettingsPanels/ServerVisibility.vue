<template>
  <div class="content-inner server-visibility" v-if="server && loaded">
    <errors-template class="errors" v-if="errors" :errors="errors" />
    <div class="details">
      Making your server visibility public means that your server will be shown
      publicly in the Nertivia's "Explore" tab.
    </div>
    <div class="content">
      <div class="toggle">
        <div class="title">Server Visibility</div>
        <div class="item" @click="privateServer = true">
          <div class="box" :class="{ selected: privateServer }"></div>
          Private
        </div>
        <div class="item" @click="privateServer = false">
          <div class="box" :class="{ selected: !privateServer }"></div>
          Public
        </div>
      </div>
      <div class="public-settings" v-if="!privateServer">
        <div class="input">
          <div class="title">
            Description (<span :class="{ warn: description.length > 150 }">{{
              description.length
            }}</span
            >/150)
          </div>
          <textarea placeholder="Description" v-model="description"></textarea>
        </div>
      </div>
      <div
        class="button"
        :class="{ disabled: saving }"
        v-if="showSaveButton && privateServer"
        @click="deleteButton"
      >
        {{ saving ? "Deleting..." : "Delete" }}
      </div>
      <div
        class="button"
        :class="{ disabled: saving }"
        v-if="alreadyPublic && showSaveButton && !privateServer"
        @click="updateButton"
      >
        {{ saving ? "Updating..." : "Update" }}
      </div>
      <div
        class="button"
        :class="{ disabled: saving }"
        v-if="!alreadyPublic && showSaveButton && !privateServer"
        @click="saveButton"
      >
        {{ saving ? "Saving..." : "Save" }}
      </div>
    </div>
  </div>
</template>

<script>
import exploreService from "../../../../../services/exploreService";
import ErrorsTemplate from "@/components/app/errorsListTemplate";

export default {
  components: { ErrorsTemplate },
  data() {
    return {
      privateServer: true,
      description: "",
      showSaveButton: false,
      saving: false,
      errors: null,
      loaded: false,
      alreadyPublic: false
    };
  },
  methods: {
    async saveButton() {
      if (this.saving) return;
      this.saving = true;
      this.errors = null;

      const data = {
        server_id: this.server.server_id,
        description: this.description
      };
      const { ok, error } = await exploreService.addServersList(data);
      if (!ok) {
        this.saving = false;
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
      if (ok) {
        this.saving = false;
        this.showSaveButton = false;
        this.alreadyPublic = true;
      }
    },
    async deleteButton() {
      if (this.saving) return;
      this.saving = true;
      this.errors = null;
      const { ok, error } = await exploreService.deleteServer(
        this.server.server_id
      );
      if (!ok) {
        this.saving = false;
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
      if (ok) {
        this.saving = false;
        this.showSaveButton = false;
        this.alreadyPublic = false;
      }
    },
    async updateButton() {
      if (this.saving) return;
      this.saving = true;
      this.errors = null;
      const { ok, error } = await exploreService.updateServer(
        this.server.server_id,
        { description: this.description }
      );
      if (!ok) {
        this.saving = false;
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
      if (ok) {
        this.saving = false;
        this.showSaveButton = false;
        this.alreadyPublic = true;
      }
    }
  },
  watch: {
    description() {
      if (this.loaded) this.showSaveButton = true;
    },
    privateServer() {
      if (this.loaded) this.showSaveButton = true;
    }
  },
  async mounted() {
    const { result, ok } = await exploreService.getServer(
      this.server.server_id
    );
    if (ok) {
      this.privateServer = false;
      this.description = result.data.description;
      this.alreadyPublic = true;
    }
    this.loaded = true;
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    }
  }
};
</script>

<style lang="scss" scoped>
.content-inner {
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: auto;
  margin-top: 30px;
  height: 100%;
}

.details {
  margin: 10px;
  opacity: 0.9;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.toggle {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 5px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  .item {
    display: flex;
    margin: 3px;
    cursor: pointer;
    .box {
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      margin-right: 5px;
      &.selected {
        background: rgba(255, 255, 255, 0.74);
      }
    }
  }
}

.public-settings {
  display: flex;
}

.input {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 10px;
  align-self: flex-start;
  height: 155px;
  width: 300px;
  display: flex;
  flex-direction: column;
  .title {
    margin: 5px;
    margin-bottom: 5px;
  }
  textarea {
    background-color: rgba(255, 255, 255, 0.1);
    resize: none;
    outline: none;
    margin-top: 0;
    margin-bottom: 0;
    padding: 10px;
    border: none;
    color: white;
    flex: 1;
  }
  .warn {
    color: rgb(255, 67, 67);
  }
}

.button {
  padding: 10px;
  border-radius: 4px;
  background: linear-gradient(
    137deg,
    rgba(45, 136, 255, 1) 0%,
    rgba(87, 160, 255, 1) 100%
  );
  -webkit-transition: background 0.3s;
  transition: 0.3s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  align-self: center;
  margin-top: auto;
  margin-bottom: 15px;
  opacity: 0.8;
  cursor: pointer;
}

.button:hover {
  opacity: 1;
  background: linear-gradient(
    137deg,
    rgba(45, 136, 255, 1) 0%,
    rgba(87, 160, 255, 1) 100%
  );
}
.button.disabled {
  background: grey;
}
.errors {
  align-self: center;
  margin: 10px;
}
@media (max-width: 614px) {
  .content-inner {
    margin-top: 0;
  }
}
</style>
