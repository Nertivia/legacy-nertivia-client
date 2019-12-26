<template>
  <div class="settings-darken-background">
    <div class="settings-box">
      <div class="tabs">
        <div
          class="tab"
          v-for="(tab, index) in tabsFiltered"
          :key="index"
          :class="{ selected: currentTab === index }"
          @click="currentTab = index"
        >
          <div class="material-icons">{{ tab.icon }}</div>
          <div class="tab-name">{{ tab.name }}</div>
        </div>
        <div class="tab warn" @click="logout">
          <div class="material-icons">exit_to_app</div>
          <div class="tab-name">Logout</div>
        </div>
      </div>
      <div class="panel">
        <div class="title">
          <div class="material-icons">{{ tabs[currentTab].icon }}</div>
          <div class="in-title">{{ tabs[currentTab].tabName }}</div>
          <div class="close-button" @click="close">
            <div class="material-icons">close</div>
          </div>
        </div>
        <component :is="tabs[currentTab].component"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/utils/Mobile";
import isElectron from "@/utils/ElectronJS/isElectron";

const MyProfile = () => import("./SettingsPanels/MyProfile.vue");
const ManageEmojis = () => import("./SettingsPanels/ManageEmojis.vue");
const MessageDesign = () => import("./SettingsPanels/MessageDesign.vue");
const MyThemes = () => import("./SettingsPanels/MyThemes.vue");
const Notifications = () => import("./SettingsPanels/Notifications.vue");
const AppSettings = () => import("./SettingsPanels/appSettings");

export default {
  components: {
    MyProfile,
    ManageEmojis,
    MessageDesign,
    MyThemes,
    Notifications,
    AppSettings
  },
  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          name: "My Profile",
          tabName: "My Profile",
          icon: "account_circle",
          component: "my-profile"
        },
        {
          name: "Message Design",
          tabName: "Message Design",
          icon: "palette",
          component: "message-design"
        },
        {
          name: "My Themes",
          tabName: "My Themes BETA",
          icon: "palette",
          component: "my-themes"
        },
        {
          name: "Manage Emojis",
          tabName: "Manage Emojis",
          icon: "face",
          component: "manage-emojis"
        },
        {
          name: "Notifications",
          tabName: "Notifications",
          icon: "message",
          component: "notifications",
          hidden: isMobile()
        },
        {
          name: "App Settings",
          tabName: "App Settings",
          icon: "desktop_windows",
          component: "app-settings",
          hidden: !isElectron
        }
      ]
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      setTimeout(() => {
        isElectron
          ? (window.location.href = "/login")
          : (window.location.href = "/");
      }, 1000);
    },
    close() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "settings",
        visibility: false
      });
    }
  },
  computed: {
    tabsFiltered() {
      return this.tabs.filter(t => t.hidden !== true);
    }
  }
};
</script>

<style scoped>
.settings-darken-background {
  position: absolute;
  background: rgba(0, 0, 0, 0.541);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999999;
  display: flex;
  color: white;
}
.settings-box {
  height: 600px;
  display: flex;
  margin: auto;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: linear-gradient(#0b4155, #01677e);
  border-radius: 4px;
}
.tabs {
  height: 100%;
  width: 200px;
  min-width: 150px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  position: relative;
  background: #00000033;
}
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 600px;
}
.tab {
  display: flex;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
  align-items: center;
}
.tab-name {
  margin-left: 10px;
}

.tab:hover {
  background: #072935;
}

.tab.selected {
  background: #051f28;
}

.tab.warn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #f54949;
}

.title {
  display: flex;
  padding: 10px;
  font-size: 25px;
  background: #05222d;
}
.title .material-icons {
  font-size: 40px;
}
.title div {
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
}
.in-title {
  flex: 1;
}
.close-button {
  display: flex;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
}
.close-button:hover {
  background: #03181f;
}
.close-button .material-icons {
  margin: auto;
  font-size: 30px;
}

/* ------- SCROLL BAR -------*/
/* width */
.tabs::-webkit-scrollbar {
  height: 3px;
}

/* Track */
.tabs::-webkit-scrollbar-track {
  background: #8080806b;
}

/* Handle */
.tabs::-webkit-scrollbar-thumb {
  background: #f5f5f559;
}

/* Handle on hover */
.tabs::-webkit-scrollbar-thumb:hover {
  background: #f5f5f59e;
}

@media (max-width: 815px) {
  .settings-box {
    width: 100%;
  }
}
@media (max-height: 609px) {
  .settings-box {
    height: 100%;
  }
}
@media (max-width: 550px) {
  .settings-box {
    flex-direction: column;
    height: 100%;
    border-radius: 0;
  }
  .tabs {
    height: 50px;
    width: 100%;
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    flex-shrink: 0;
  }
  .tab.warn {
    position: relative;
  }
  .tab {
    flex-shrink: 0;
  }
  .panel {
    width: 100%;
  }
}
</style>
