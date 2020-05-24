<template>
  <div class="content server-manage-roles">
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
        <draggable
          v-model="roles"
          :animation="200"
          :delay="mobile ? 400 : 0"
          ghost-class="ghost"
          @end="onEnd"
        >
          <div
            class="role"
            v-for="(role, index) in roles"
            :key="role.id"
            :class="{ selected: index === selectedRoleIndex }"
            @click="roleClick($event, index)"
          >
            <div class="name" :style="{ color: role.color }">{{ role.name }}</div>
          </div>
        </draggable>
      </div>
      <div class="details" v-if="roles && roles[selectedRoleIndex]">
        <div class="inner-details">
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

          <div class="input">
            <div class="input-title">Settings</div>
            <div class="check-box" @click="updateSettings('hideRole')">
              <div class="box" :class="{ checked: update.hideRole !== undefined ? update.hideRole :  roles[selectedRoleIndex].hideRole  }" />
              <div>
                <div class="name">Hide Role</div>
                <div
                  class="info"
                >Display members with this role along with all the default members.</div>
              </div>
            </div>
          </div>
          <div class="input">
            <div class="input-title">Permissions</div>
            <div
              class="check-box"
              @click="updatePermissions(perm.value)"
              v-for="(perm, index) in perms"
              :key="index"
            >
              <div class="box" :class="{ checked: perm.hasPerm }" />
              <div>
                <div class="name">{{ perm.name }}</div>
                <div class="info">{{ perm.info }}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="button"
          v-if="(update.name || update.permissions !== undefined || update.color) || update.hideRole !== undefined"
          @click="updateRole"
        >Save Changes</div>
        <div
          class="button warn delete-server disabled"
          v-if="
            !roles[selectedRoleIndex].deletable ||
              roles[selectedRoleIndex].default
          "
        >
          {{
          roles[selectedRoleIndex].default
          ? "Cannot delete default role."
          : "Cannot delete this role."
          }}
        </div>
        <div
          class="button warn delete-server"
          :class="{ disabled: deleteClicked }"
          v-if="
            roles[selectedRoleIndex].deletable &&
              !roles[selectedRoleIndex].default === true
          "
          @click="deleteRole"
        >{{ deleteButtonConfirmed ? "ARE YOU SURE?" : "Delete Role" }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ServerService from "@/services/ServerService";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";
import { isMobile } from "@/utils/Mobile";
import draggable from "vuedraggable";
import {
  permissions,
  addPerm,
  containsPerm,
  removePerm
} from "@/utils/RolePermissions";

export default {
  components: { ErrorsListTemplate, draggable },
  data() {
    return {
      deleteButtonConfirmed: false,
      deleteClicked: false,
      selectedRoleIndex: 0,
      errors: null,
      mobile: isMobile(),
      update: {
        name: null
      }
    };
  },
  methods: {
    async onEnd(test) {
      const newIndex = test.newIndex;
      const role = this.roles[newIndex];
      const sendObj = { roleID: role.id, order: newIndex };
      await ServerService.updateRolesPosition(this.server.server_id, sendObj);
    },
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
        this.update = { name: null};
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
    async deleteRole() {
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
    updateSettings(key) {
      if (this.update.hideRole !== undefined) {
        this.$set(this.update, key, !this.update.hideRole)
      } else {
        this.$set(this.update, key, !this.roles[this.selectedRoleIndex].hideRole)
      }
      
    },
    updatePermissions(value) {
      const updatePerm = this.update.permissions;
      const rolePerm = this.roles[this.selectedRoleIndex].permissions;

      let permissions;

      if (updatePerm != undefined) {
        permissions = updatePerm;
      } else {
        permissions = rolePerm;
      }
      if (containsPerm(permissions, value)) {
        permissions = removePerm(permissions, value);
      } else {
        permissions = addPerm(permissions, value);
      }
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
    roles: {
      get() {
        const roles = this.$store.getters["servers/roles"][
          this.server.server_id
        ];
        if (!roles) {
          return [];
        }
        return [...roles].sort((a, b) => {
          if (b.default) {
            return -1;
          }
          return a.order - b.order;
        });
      },
      set(value) {
        this.$store.dispatch(
          "servers/setServerRoles",
          value.map((v, i) => {
            return { ...v, ...{ order: i } };
          })
        );
      }
    },
    perms() {
      return Object.values(permissions).map(p => {
        const updatePerm = this.update.permissions;
        const rolePerm = this.roles[this.selectedRoleIndex].permissions;
        if (updatePerm != undefined) {
          return { ...p, ...{ hasPerm: containsPerm(updatePerm, p.value) } };
        } else {
          return { ...p, ...{ hasPerm: containsPerm(rolePerm, p.value) } };
        }
      });
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
.ghost {
  opacity: 0;
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
  position: relative;
  padding: 5px;
  user-select: none;
  cursor: pointer;
  transition: background 0.3s;
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
  background: rgba(0, 0, 0, 0.2);
}
.role.selected {
  background: rgba(0, 0, 0, 0.4);
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
  overflow: auto;
}
.inner-details {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
}
.button {
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  align-self: center;
  margin: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
  border-radius: 4px;
}
.button:hover {
  background: rgba(0, 0, 0, 0.6);
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
  flex-shrink: 0;
}
.input {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10px;
  margin: 10px;
  overflow: auto;
  flex-shrink: 0;
}
.input input {
  width: 100%;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  margin-top: 0;
  border-radius: 4px;
}
.role-input {
  overflow: initial;
  flex-shrink: 0;
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
  border-radius: 4px;
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
    height: 30px;
    width: 30px;
    flex-shrink: 0;
    background-color: rgb(95, 95, 95);
    margin-right: 5px;
    border-radius: 2px;
    &.checked {
      background-color: rgb(31, 154, 255);
    }
  }
  .info {
    color: rgb(255, 255, 255);
    opacity: 0.7;
    font-size: 15px;
  }
}
</style>
