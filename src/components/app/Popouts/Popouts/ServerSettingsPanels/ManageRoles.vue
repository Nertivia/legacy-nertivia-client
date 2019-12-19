<template>
  <div class="content">
    <errors-list-template :errors="errors" v-if="errors" />
    <div class="content-inner">
      <div class="roles-list">
        <div
          class="role add-role-button"
          :class="{ warn: Object.keys(channels).length === 50 }"
          @click="addRole()"
        >
          <div class="material-icons">add</div>
          <div>Add Role</div>
        </div>
        <div
          class="role"
          v-for="(role, index) in roles"
          :key="role.id"
          :class="{ selected: index === selectedRoleIndex }"
          @click="roleClick($event, index)"
        >
          <div class="name" :style="{ color: role.color }">{{ role.name }}</div>
        </div>
      </div>
      <div class="details" v-if="roles && roles[selectedRoleIndex]">
        <div class="input role-input">
          <div class="input-title">Role Name</div>
          <div
            class="role-color"
            :style="{
              backgroundColor: update.color || roles[selectedRoleIndex].color
            }"
          >
            <div class="color-picker" @click="$refs.colorPic.click()">
              <input
                type="color"
                ref="colorPic"
                style="display: none"
                @change="colorChangeEvent"
                value="#e7e7e7"
              />
              <div class="material-icons">color_lens</div>
            </div>
            <input
              type="text"
              ref="name"
              placeholder="Role Name"
              :default-value.prop="roles[selectedRoleIndex].name"
              @input="inputEvent('name', $event)"
            />
          </div>
        </div>
        <!-- <div class="input">
          <div class="input-title">Permissions</div>
          <div class="check-box" @click="updatePermissions('send_message')">
            <div class="box" :class="{ checked: sendMessagePermission }" />
            <div class="name">Send Messages</div>
          </div>
        </div> -->

        <div
          class="button"
          v-if="update.name || update.permissions || update.color"
          @click="updateRole"
        >
          Save Changes
        </div>
        <div
          class="button warn delete-server disabled"
          v-if="!roles[selectedRoleIndex].deletable"
        >
          Cannot delete this role.
        </div>
        <div
          class="button warn delete-server"
          :class="{ disabled: deleteClicked }"
          v-if="roles[selectedRoleIndex].deletable"
          @click="deleteChannel"
        >
          {{ deleteButtonConfirmed ? "ARE YOU SURE?" : "Delete Role" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServerService from "@/services/ServerService";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";
export default {
  components: { ErrorsListTemplate },
  data() {
    return {
      deleteButtonConfirmed: false,
      deleteClicked: false,
      selectedRoleIndex: 0,
      errors: null,
      update: {
        name: null
      }
    };
  },
  methods: {
    async addRole() {
      await ServerService.createRole(this.server.server_id, {});
    },
    async updateRole() {
      this.errors = null;
      let data = {
        name: this.update.name || this.roles[this.selectedRoleIndex].name
      };

      data = Object.assign({}, this.update, data);

      // if (this.update.permissions) {
      //   data.permissions = this.update.permissions;
      // }
      const { ok, error } = await ServerService.updateRole(
        this.server.server_id,
        this.roles[this.selectedRoleIndex].id,
        data
      );
      if (ok) {
        this.update = { name: null };
      } else {
        if (error.response) {
          if (error.response.data.message)
            this.errors = [{ msg: error.response.data.message }];
          else this.errors = error.response.data.errors;
        } else {
          this.errors = [{ msg: "Something went wrong." }];
        }
      }
    },
    async deleteChannel() {
      if (this.deleteClicked) return;
      if (!this.deleteButtonConfirmed) {
        return (this.deleteButtonConfirmed = true);
      }
      this.deleteClicked = true;
      await ServerService.deleteRole(
        this.server.server_id,
        this.roles[this.selectedRoleIndex].id
      );
      this.deleteButtonConfirmed = false;
      this.selectedRoleIndex = null;
      this.deleteClicked = false;
    },
    inputEvent(name, event) {
      this.update.name = event.target.value;
    },
    roleClick(event, index) {
      this.selectedRoleIndex = index;
      this.$nextTick(() => {
        this.$refs["name"].value = this.roles[this.selectedRoleIndex].name;
        this.update = { name: null };
        this.deleteButtonConfirmed = false;
      });
    },
    updatePermissions(permissionName) {
      const permissions = this.update.permissions || {};
      permissions[permissionName] = !this.sendMessagePermission;
      this.$set(this.update, "permissions", permissions);
    },
    colorChangeEvent(e) {
      const hexColor = e.target.value;
      e.target.value = "";
      this.$set(this.update, "color", hexColor);
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    },
    roles() {
      return this.$store.getters["servers/roles"][this.server.server_id];
    },
    channels() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      const channels = this.$store.getters.channels;
      const channelIDs = this.$store.getters["servers/channelsIDs"][serverID];
      return channelIDs.map(c => {
        return channels[c];
      });
    },
    sendMessagePermission() {
      const channel = this.channels[this.selectedRoleIndex];
      const permissions = this.update.permissions || undefined;
      if (permissions) {
        return !!permissions.send_message;
      }
      if (!channel.permissions) {
        return true;
      }
      return !!channel.permissions.send_message;
    }
  }
};
</script>

<style scoped lang="scss">
.server-avatar {
  background: grey;
  height: 90px;
  width: 90px;
  border-radius: 50%;
}
.content-inner {
  display: flex;
  height: 100%;
  position: relative;
}
.roles-list {
  background: rgba(0, 0, 0, 0.12);
  height: 100%;
  width: 165px;
  flex-shrink: 0;
  overflow: auto;
}
.role {
  padding: 5px;
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.role .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.role div {
  align-self: center;
}
.role:hover {
  background: #04232d;
}
.role.selected {
  background: #03191f;
}
.add-role-button {
  background: rgba(17, 148, 255, 0.692);
  transition: 0.3s;
}
.add-role-button:hover {
  background: rgb(17, 148, 255);
}
.details {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}
.button {
  background: #024554;
  padding: 10px;
  align-self: center;
  margin: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
}
.button:hover {
  background: #02303c;
}
.button.warn {
  background: rgba(255, 17, 17, 0.692);
}
.button.warn:hover {
  background: rgb(255, 17, 17);
}
.button.disabled {
  background: grey;
}
.button.disabled:hover {
  background: grey;
}
.add-role-button.warn {
  background: rgba(255, 17, 17, 0.192);
  cursor: not-allowed;
}

.delete-server {
  margin: auto;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  align-self: initial;
  border-radius: 0;
  text-align: center;
}
.input {
  display: flex;
  flex-direction: column;
  background-color: #044050;
  padding: 10px;
  margin: 10px;
}
.input input {
  width: 100%;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  margin-top: 0;
}

.role-name {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.role-color {
  display: flex;
  flex-shrink: 0;
  background: rgb(255, 255, 255);
  transition: 0.2s;
  margin-top: 5px;
}

.color-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  flex-shrink: 0;
  user-select: none;
  color: rgba(255, 255, 255, 0.877);
  cursor: pointer;
  .material-icons {
    text-shadow: 0px 0px 9px #000000bb;
  }
}

.check-box {
  display: flex;
  margin: 5px;
  align-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  .box {
    height: 20px;
    width: 20px;
    flex-shrink: 0;
    background-color: rgb(255, 31, 31);
    margin-right: 5px;
    border-radius: 2px;
    &.checked {
      background-color: rgb(31, 154, 255);
    }
  }
}
</style>
