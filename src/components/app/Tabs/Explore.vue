<template>
  <div class="explore-tab" :class="{ darken: showLeftPanel }">
    <transition name="slidein">
      <div
        class="left-panel"
        v-show="($mq === 'mobile' && showLeftPanel) || $mq !== 'mobile'"
        v-click-outside="hideLeftPanel"
      >
        <navigation />
        <div class="content">
          <MyMiniInformation />
          <div class="header">
            <div class="icon">
              <i class="material-icons">explore</i>
            </div>
            <div class="details">
              <div class="title">Explore</div>
              <div class="description">Find new servers, Emojis and more!</div>
            </div>
          </div>
          <div class="items">
            <div
              class="item"
              v-for="(tab, index) in tabs"
              :key="index"
              :class="{ selected: selectedTab === index }"
              @click="
                selectedTab = index;
                showLeftPanel = false;
              "
            >
              <i class="material-icons">{{ tab.icon }}</i>
              {{ tab.name }}
            </div>
            <div
              class="card self-promo"
              v-if="nertiviaServerHide !== true && !nertiviaServer"
            >
              <div class="material-icons close-btn" @click="hideSelfPromo">
                close
              </div>
              <div class="logo" />
              <div class="title">Join the official Nertivia server</div>
              <div class="button" @click="joinNertiviaServer">Join</div>
            </div>

            <div class="card donate-paypal" v-if="donateHide !== true">
              <div class="material-icons close-btn" @click="hideDonatePaypal">
                close
              </div>
              <div class="material-icons heart">favorite</div>
              <div class="title">
                Support Nertivia by donating any amount of money. You will get a
                supporter badge and more features in the future.
              </div>
              <div class="button" @click="donateButton">Donate</div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="right-panel">
      <div class="header">
        <div
          class="material-icons left-menu-show-button"
          @click="showLeftPanel = !showLeftPanel"
        >
          view_list
        </div>
        <i class="material-icons">{{ tabs[selectedTab].icon }}</i>
        {{ tabs[selectedTab].name }}
      </div>
      <div class="coming-soon" v-if="selectedTab > 1">
        <div class="icon">
          <i class="material-icons">explore</i>
        </div>
        <div class="text">Coming soon!</div>
      </div>
      <component :is="tabs[selectedTab].component" />
    </div>
  </div>
</template>

<script>
import Servers from "./Explore/servers";
import Themes from "./Explore/themes";
import ServerService from "@/services/ServerService";
import Navigation from "@/components/app/Navigation";
import MyMiniInformation from "@/components/app/MyMiniInformation.vue";
export default {
  components: { Servers, Themes, Navigation, MyMiniInformation },
  data() {
    return {
      showLeftPanel: false,
      selectedTab: 0,
      tabs: [
        // {icon: "home", name: "home", component: ""},
        { icon: "rss_feed", name: "Servers", component: "Servers" },
        { icon: "brush", name: "Themes", component: "Themes" },
        { icon: "face", name: "Emoji Packs", component: "" },
        { icon: "message", name: "Message Styles", component: "" }
      ],
      nertiviaServerID: "6572915451527958528",
      nertiviaServerHide:
        localStorage.getItem("exploreTabNertiviaServerPromoHide") === "true",
      donateHide: localStorage.getItem("exploreTabDonateHide") === "true"
    };
  },

  methods: {
    hideLeftPanel(event) {
      if (this.showLeftPanel) {
        if (event.target.closest(".left-menu-show-button") == null) {
          this.showLeftPanel = false;
        }
      }
    },
    hideSelfPromo() {
      localStorage.setItem("exploreTabNertiviaServerPromoHide", true);
      this.nertiviaServerHide = true;
    },
    hideDonatePaypal() {
      localStorage.setItem("exploreTabDonateHide", true);
      this.donateHide = true;
    },
    async joinNertiviaServer() {
      await ServerService.joinServerById(this.nertiviaServerID, {
        socketID: this.$socket.client.id
      });
    },
    donateButton() {
      window.open("https://www.paypal.me/DiscordDevHelp", "_blank");
    }
  },
  mounted() {},
  computed: {
    nertiviaServer() {
      return this.$store.getters["servers/servers"][this.nertiviaServerID];
    }
  }
};
</script>

<style lang="scss" scoped>
.explore-tab {
  display: flex;
  width: 100%;
  height: 100%;
  color: white;
  position: relative;
}
.left-panel {
  display: flex;
  flex-direction: row;
  width: 340px;
  max-width: calc(100% - 60px);
  flex-shrink: 0;
  z-index: 2;

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: rgba(0, 0, 0, 0.14);
    border-top-left-radius: 10px;
    overflow: hidden;
  }
  .items {
    user-select: none;
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 3px;
    }
    .item {
      .material-icons {
        margin-right: 5px;
      }
      position: relative;
      display: flex;
      align-content: center;
      align-items: center;
      padding: 10px;
      margin: 5px;
      border-radius: 4px;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        background: #053c4c;
      }
      &.selected {
        background: #053240;
      }
    }
    .item:nth-child(2)::before {
      content: "NEW";
      font-size: 14px;
      background: rgb(255, 55, 55);
      border-radius: 2px;
      padding: 2px;
      position: absolute;
      right: 10px;
    }
  }
  .header {
    display: flex;
    height: 100px;
    background: rgba(0, 0, 0, 0.3);
    user-select: none;
    flex-shrink: 0;
    .icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      align-content: center;
      justify-content: center;
      flex-shrink: 0;
      width: 70px;
      position: relative;
      .material-icons {
        font-size: 50px;
      }
      &::after {
        content: "BETA";
        position: absolute;
        background: #ff3333;
        border-radius: 5px;
        font-size: 9px;
        padding: 2px;
        bottom: 20px;
        z-index: 999;
      }
    }
    .details {
      align-self: center;
      .title {
        font-size: 20px;
        margin-bottom: 5px;
        position: relative;
      }
      .description {
        color: #b2d1d4;
        font-size: 14px;
      }
    }
  }
}

.card {
  background: black;
  height: 180px;
  border-radius: 5px;
  margin: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
  .title {
    text-align: center;
  }
  .button {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 5px;
    font-size: 17px;
    margin-top: 15px;
    flex-shrink: 0;
    cursor: pointer;
    transition: 0.3s;
    color: rgba(255, 255, 255, 0.924);
    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }
  &.self-promo {
    .logo {
      background-image: url("../../../assets/logo.png");
      background-size: cover;
      height: 100px;
      width: 100px;
      margin-bottom: 10px;
    }
    margin-top: 50px;
    background: #3fa9f5;
  }
  &.donate-paypal {
    margin-top: 20px;
    background: #f53f3f;
    .title {
      font-size: 15px;
      opacity: 0.9;
    }
    .heart {
      font-size: 60px;
      margin-bottom: 10px;
    }
  }
}
.coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: white;
  .material-icons {
    font-size: 100px;
  }
}

.right-panel {
  .header {
    background: #063443;
    padding-left: 10px;
    height: 54px;
    display: flex;
    align-items: center;
    align-content: center;
    .material-icons {
      margin-right: 5px;
    }
    user-select: none;
    cursor: default;
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.left-menu-show-button {
  border-right: solid 1px rgb(158, 158, 158);
  padding-right: 5px;
  display: none;
  cursor: pointer;
}

.slidein-enter-active,
.slidein-leave-active {
  transition: 0.5s;
}
.slidein-enter, .slidein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  /* margin-left: -300px; */
  transform: translateX(-340px);
}

@media (max-width: 600px) {
  .left-menu-show-button {
    display: block;
  }
  .left-panel {
    position: absolute;
    bottom: 0;
    z-index: 2;
    background: rgba(19, 107, 139, 0.9);
    height: 100%;
  }
  .darken::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
