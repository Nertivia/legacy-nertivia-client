<template>
  <div class="explore-tab">
    <transition name="slidein">
      <div
        class="left-panel"
        v-show="$mq === 'mobile' && showLeftPanel || ($mq !== 'mobile')"
        v-click-outside="hideLeftPanel"
      >
        <navigation />
        <div class="content">
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
              :class="{selected: selectedTab === index}"
              @click="selectedTab = index; showLeftPanel = false;"
            >
              <i class="material-icons">{{tab.icon}}</i>
              {{tab.name}}
            </div>
            <div class="card self-promo" v-if="nertiviaServerHide !== true && !nertiviaServer">
              <div class="material-icons close-btn" @click="hideSelfPromo">close</div>
              <div class="logo" />
              <div class="title">Join the official Nertivia server</div>
              <div class="button" @click="joinNertiviaServer">Join</div>
            </div>

            <div class="card donate-paypal" v-if="donateHide !== true">
              <div class="material-icons close-btn" @click="hideDonatePaypal">close</div>
              <div class="material-icons heart">favorite</div>
              <div
                class="title"
              >Support Nertivia by donating any amount of money. You will get a supporter badge and more features in the future.</div>
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
        >view_list</div>
        <i class="material-icons">{{tabs[selectedTab].icon}}</i>
        {{tabs[selectedTab].name}}
      </div>
      <div class="coming-soon" v-if="selectedTab > 0">
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
import { bus } from "@/main";
import Servers from "./Explore/servers";
import ServerService from "@/services/ServerService";
import Navigation from "@/components/app/Navigation";
export default {
  components: { Servers, Navigation },
  data() {
    return {
      showLeftPanel: false,
      selectedTab: 0,
      tabs: [
        // {icon: "home", name: "home", component: ""},
        { icon: "rss_feed", name: "Servers", component: "servers" },
        { icon: "face", name: "Emoji Packs", component: "" },
        { icon: "brush", name: "Themes", component: "" },
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
      const { ok, error, result } = await ServerService.joinServerById(
        this.nertiviaServerID,
        {
          socketID: this.$socket.id
        }
      );
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
  width: 300px;
  flex-shrink: 0;
  z-index: 2;
  background-image: url("../../../assets/leftPanelBackground.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
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
      display: flex;
      align-content: center;
      align-items: center;
      padding: 10px;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        background: #08616b;
      }
      &.selected {
        background: #064c55;
      }
    }
  }
  .header {
    display: flex;
    height: 100px;
    background: #086974;
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
    background: rgba(0, 0, 0, 0.448);
    padding: 10px;
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
  transform: translateX(-300px);
}

@media (max-width: 600px) {
  .left-menu-show-button {
    display: block;
  }
  .left-panel {
    position: absolute;
    bottom: 0;
    height: calc(100% - 44px);
    z-index: 2;
  }
}
</style>
