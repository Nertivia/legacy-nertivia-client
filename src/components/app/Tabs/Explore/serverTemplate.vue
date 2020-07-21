<template>
  <div class="item" :class="{verified: server.server.verified}" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="top">
      <div
        class="background-dark"
        v-if="server.server.banner"
        :style="{
          backgroundImage: `url(${nertiviaCDN + server.server.banner}${
            hover ? '' : '?type=webp'
          })`
        }"
      />
      <div class="pfp">
        <profile-picture
          class="avatar"
          animationPadding="0"
          size="90px"
          :avatar="server.server.avatar"
          :uniqueID="server.server.server_id"
          :hover="true"
        />
        <div class="verified" v-if="server.server.verified" title="Verified Server">
          <span class="material-icons">check</span>
        </div>
      </div>
      <div class="name">
        <div class="name-container" :title="server.server.name ">
          <span class="inner-name">{{ server.server.name }}</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="description">{{ server.description }}</div>
      <div class="buttons">
        <div class="member-count">
          <div class="material-icons">account_box</div>
          {{ server.total_members }}
        </div>
        <div class="button" :class="{ selected: joined }" @click="joinButton">
          <span v-if="joined">{{$t('joined')}}</span>
          <spinner v-else-if="joinClicked" :size="30" />
          <span v-else-if="!joinClicked">{{$t('join-server')}}</span>
        </div>
      </div>
      <div class="created-by">
        {{this.$t('created-by')}}
        <span @click="openUserInformation">{{ server.creator.username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/global/Spinner";
import ServerService from "@/services/ServerService";
import config from "@/config.js";
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";

export default {
  components: { Spinner, ProfilePicture },
  props: ["server"],
  data() {
    return {
      joinClicked: false,
      nertiviaCDN: config.nertiviaCDN,

      hover: false
    };
  },
  methods: {
    openUserInformation() {
      this.$store.dispatch(
        "setUserInformationPopout",
        this.server.creator.uniqueID
      );
    },
    async joinButton() {
      if (this.joinClicked || this.joined) return;
      this.joinClicked = true;

      const { ok } = await ServerService.joinServerById(
        this.server.server.server_id,
        {
          socketID: this.$socket.client.id
        }
      );
      if (ok) {
        this.joinClicked = false;
      }
    }
  },
  computed: {
    joined() {
      return this.$store.getters["servers/servers"][
        this.server.server.server_id
      ];
    },
    channels() {
      return this.$store.getters.channels;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/global";
.pfp {
  position: relative;
  .verified {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    background-color: #267dff;
    border-radius: 50%;
    right: 3px;
    bottom: 3px;
    position: absolute;
    .material-icons {
      color: #ffffff;
      font-size: 13px;
    }
  }
}
.verified .avatar {
  border: solid 3px rgba(30, 146, 255, 0.856);
}
.item {
  position: relative;
  width: 250px;
  height: 300px;
  background: $other-box-color;
  box-shadow: 0px 0px 5px 0px #000000bd;
  margin: 5px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: 0.3s;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  overflow: hidden;

  .top {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 5px 0px #000000bd;
    width: 100%;
    height: 150px;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-shrink: 0;
    position: relative;
    .background-dark {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      background-position: center;
      background-size: cover;
      &::before {
        content: "";
        position: absolute;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.6);
      }
    }
    .avatar {
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
    }
    .name {
      margin-top: 9px;
      font-size: 21px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: center;
      display: flex;
      z-index: 999;
      .name-container {
        display: flex;
        margin: auto;
      }
      .inner-name {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    flex-shrink: 0;
    overflow: auto;

    .description {
      margin: 10px;
      flex: 1;
      opacity: 0.9;
      overflow: auto;
      font-size: 14px;
      word-break: break-word;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      flex-shrink: 0;
    }

    .buttons {
      display: flex;
      width: 100%;
      flex-direction: row;
      margin-bottom: 10px;
    }
    .member-count {
      display: flex;
      align-items: center;
      align-content: center;
      padding-left: 5px;
      padding-right: 5px;
      margin-left: 10px;
      margin-top: 0px;
      border-radius: 4px;
      margin-right: 10px;
      flex: 1;
      background: rgba(255, 255, 255, 0.3);
      .material-icons {
        margin-right: 5px;
      }
    }
    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      text-align: center;
      height: 36px;
      border-radius: 4px;
      background: $primary-button-color;
      transition: 0.2s;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &.selected {
        background: grey;
      }
    }
  }
}
.created-by {
  margin-left: 10px;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  span {
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      color: white;
    }
  }
}
</style>
