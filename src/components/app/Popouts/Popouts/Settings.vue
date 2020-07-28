<template>
  <div class="settings-darken-background settings-popout">
    <div class="settings-box">
      <div class="tabs">
        <div
          class="tab"
          v-for="tab in tabsFiltered"
          :key="tab.index"
          :class="{ selected: currentTab === tab.index }"
          @click="currentTab = tab.index"
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
        <div class="close-button-desktop" @click="close"><div class="material-icons">close</div></div>
        <div class="title">
          <div class="material-icons" :class="tabs[currentTab].icon">{{ tabs[currentTab].icon }}</div>
          <div class="in-title">{{ tabs[currentTab].tabName }}</div>
          <div class="close-button" @click="close">
            <div class="material-icons">close</div>
          </div>
        </div>
        <component :is="tabs[currentTab].component"></component>
        <div class="support-donate">
          <div class="icon"><div class="material-icons heart">favorite</div></div>
          <div class="text">{{$t('support-message-settings')}}</div>
          <div class="button" @click="donateButton">{{$t('donate')}}</div>
        </div>
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
const DebugSettings = () => import("./SettingsPanels/DebugSettings");
const LanguageSettings = () => import("./SettingsPanels/LanguageSettings");
const ActivityStatus = () => import("./SettingsPanels/ActivityStatus");
const myBots = () => import("./SettingsPanels/myBots");

export default {
  components: {
    MyProfile,
    ManageEmojis,
    MessageDesign,
    MyThemes,
    Notifications,
    AppSettings,
    DebugSettings,
    ActivityStatus,
    myBots,
    LanguageSettings
  },
  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          name: "My Profile",
          tabName: "My Profile",
          icon: "account_circle",
          component: "my-profile",
          index: 0
        },
        {
          name: "Message Design",
          tabName: "Message Design",
          icon: "palette",
          component: "message-design",
          index: 1
        },
        {
          name: "My Themes",
          tabName: "My Themes",
          icon: "palette",
          component: "my-themes",
          index: 2
        },
        {
          name: "Manage Emojis",
          tabName: "Manage Emojis",
          icon: "face",
          component: "manage-emojis",
          index: 3
        },
        {
          name: "Notifications",
          tabName: "Notifications",
          icon: "message",
          component: "notifications",
          hidden: isMobile(),
          index: 4
        },
        {
          name: "Activity Status",
          tabName: "Activity Status BETA",
          icon: "widgets",
          component: "activity-status",
          hidden: !isElectron,
          index: 5
        },
        {
          name: "App Settings",
          tabName: "App Settings",
          icon: "desktop_windows",
          component: "app-settings",
          hidden: !isElectron,
          index: 6
        },
        {
          name: "My Bots",
          tabName: "My Bots",
          icon: "adb",
          component: "my-bots",
          index: 7
        },
        {
          name: "Language BETA",
          tabName: "Language",
          icon: "flag",
          component: "language-settings",
          index: 8
        },
        {
          name: "Debug",
          tabName: "Debug",
          icon: "bug_report",
          component: "debug-settings",
          index: 9
        }
      ]
    };
  },
  methods: {
    donateButton() {
      window.open("https://www.paypal.me/DiscordDevHelp", "_blank");
    },
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

<style scoped lang="scss">
@import "@/styles/global";

.settings-darken-background {
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999999;
  display: flex;
  color: white;
}
.settings-box {
  flex: 1;
  width: 100%;
  display: flex;
  margin: 40px;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #000000bd;
  background: $other-box-color;
  border-radius: 4px;
  backdrop-filter: blur(10px);
}
.tabs {
  height: 100%;
  width: 200px;
  min-width: 150px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  background: #272e37da;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5); 
  position: relative;
}
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.tab {
  display: flex;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
}
.tab-name {
  margin-left: 10px;
}

.tab:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.tab.selected {
  color: white;
  background: linear-gradient(137deg, rgba(45,136,255,1) 0%, rgba(87,160,255,1) 100%);
}

.tab.warn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #f54949;
}

.title {
  display: none;
  padding: 10px;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.1);
}
.title .material-icons {
  font-size: 30px;
}
.title div {
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
}
.close-button-desktop {
  background: rgba(255, 255, 255, 0.1);
  transition: 0.2s;
  border-radius: 5px;
  margin: 5px;
  height: 23px;
  user-select: none;
  position: absolute;
  right: 0;
  top: 0;
  align-self: flex-end;
  z-index: 1111111;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
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
    margin: 0;
  }
  .title {
    display: flex;
  }
  .close-button-desktop {
    display: none;
  }
}

.support-donate {
  display: flex;
  align-content: center;
  align-items: center;
  min-height: 30px;
  background: #f53f3f;
  user-select: none;
  .button {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0.8;
    padding-left: 5px;
    padding-right: 5px;
    height: 100%;
    margin: auto;
    margin-right: 0;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.2);
    }
  }
  .icon .material-icons {
    font-size: 18px;
    margin-left: 5px;
    margin-top: 3px;
  }
  .text {
    margin-left: 3px;
  }
}
@media (max-width: 550px) {
  .support-donate {
    display: none;
  }
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
