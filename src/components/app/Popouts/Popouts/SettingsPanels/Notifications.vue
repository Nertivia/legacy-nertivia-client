<template>
  <div class="my-profile-panel">
    <div class="switches">
      <div class="checkbox" @click="toggleNotificationSounds">
        <div
          class="checkbox-box"
          :class="{selected: !notificationSettings.disableNotificationSound}"
        />
        <div class="checkbox-name">Notification Sounds</div>
      </div>
      <div class="checkbox" @click="toggleNotification()">
        <div
          class="checkbox-box"
          :class="{selected: !notificationSettings.disableDesktopNotification}"
        />
        <div class="checkbox-name">Desktop Notifications</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";

import SettingsService from "@/services/settingsService.js";

export default {
  data() {
    return {
      isElectron: window && window.process && window.process.type
    };
  },
  methods: {
    toggleSetting(key) {
      const setting = this.notificationSettings[key];
      if (!setting || setting === false)
        this.$store.dispatch("settingsModule/updateNotification", {
          [key]: true
        });
      else
        this.$store.dispatch("settingsModule/updateNotification", {
          [key]: false
        });
    },
    toggleNotification() {
      const _this = this;
      const setting = this.notificationSettings["disableDesktopNotification"];
      if (setting && setting === true && !this.isElectron) {
        if (Notification.permission === "denied") {
          alert(
            "Notifications permission is blocked. Allow notifications from this website in your browsers permission settings."
          );
        }
        Notification.requestPermission().then(function(result) {
          if (result === "denied" || result === "default") return;
          _this.$store.dispatch("settingsModule/updateNotification", {
            disableDesktopNotification: false
          });
        });
        return;
      }
      this.toggleSetting("disableDesktopNotification");
    },
    toggleNotificationSounds() {
      const setting = this.notificationSettings["disableNotificationSound"];
      this.$store.dispatch("settingsModule/updateNotification", {
        disableNotificationSound: !setting
      });
    }
  },
  mounted() {
    if (
      !this.isElectron &&
      this.notificationSettings.disableDesktopNotification === undefined
    ) {
      this.$store.dispatch("settingsModule/updateNotification", {
        disableDesktopNotification: true
      });
    }
  },
  computed: {
    notificationSettings() {
      return this.$store.getters["settingsModule/settings"].notification;
    },
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>
<style scoped>
.switches {
  display: flex;
  flex-direction: column;
  margin: 20px;
  user-select: none;
}

.checkbox {
  display: flex;
  margin-top: 10px;
  cursor: pointer;
}
.checkbox-box {
  background: rgba(88, 88, 88, 0.74);
  height: 20px;
  width: 20px;
  margin-right: 10px;
  transition: 0.3s;
}

.checkbox-box.selected {
  background: rgba(66, 122, 244, 0.74);
}

.checkbox-box.selected:hover {
  background: rgba(66, 122, 244, 0.94);
}

.checkbox-box:hover {
  background: rgba(88, 88, 88, 0.94);
}
.checkbox-name {
  max-width: 200px;
}

.message-example {
  padding: 10px;
  background: rgba(88, 88, 88, 0.44);
  border-radius: 10px;
  margin: 10px;
}
.title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 5px;
}

.hidden {
  display: none;
}
.my-profile-panel {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
</style>
