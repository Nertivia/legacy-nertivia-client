<template>
  <div class="my-mini-information" :style="{backgroundColor: getStatusColor}">
    <div class="profile-pic-outer">
      <profile-picture :url="avatar" :admin="user.admin" size="50px" :hover="true" @click.native="openUserInformation"/>
    </div>
    <div class="information">
      <div class="name">{{user.username}}</div>
      <div class="tag">@{{user.tag}}</div>

      <div class="status" v-on:click="status.isPoppedOut = !status.isPoppedOut">
        <img class="current-status" :src="getStatus">
        <i class="material-icons expand-status-icon">expand_more</i>
        <transition name="show-status-list">
          <statusList v-if="status.isPoppedOut" v-click-outside="closeMenus" class="status-popout"/>
        </transition>
      </div>
    </div>
    <div
      class="setting-icon survay-button"
      v-if="!user.survey_completed || user.survey_completed === false"
      @click="openSurvey"
    >
      <div class="survay-inner">
        <i class="material-icons">error</i>
      </div>
    </div>
    <div class="setting-icon" @click="openSettings">
      <i class="material-icons">settings</i>
    </div>
  </div>
</template>

<script>
import { bus } from "../../main";
import config from "@/config.js";
import statusList from "../../components/app/statusList.vue";
import settingsService from "@/services/settingsService";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import statuses from '@/utils/statuses';

export default {
  components: {
    statusList,
    ProfilePicture
  },
  data() {
    return {
      status: {
        isPoppedOut: false
      }
    };
  },
  methods: {
    openUserInformation() {
      this.$store.dispatch('setUserInformationPopout', this.user.uniqueID)
    },
    closeMenus() {
      this.status.isPoppedOut = false;
    },
    openSurvey() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "surveyPopout",
        visibility: true
      });
    },
    async changeStatus(status) {
      // emit to server to change their status.
      const { ok, error, result } = await settingsService.setStatus(status);
      if (ok && result.data.status == true) {
        this.$store.dispatch("changeStatus", result.data.set);
      }
    },
    openSettings() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "settings",
        visibility: true
      });
    }
  },
  created() {
    //When user changes their own status (statusList.vue)
    bus.$on("status-change", this.changeStatus);
  },
  beforeDestroy() {
    bus.$off("status-change", this.changeStatus);
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    avatar() {
      return config.domain + "/avatars/" + this.$store.getters.user.avatar;
    },
    getStatus() {
      return require(`./../../assets/status/${this.$store.getters.user.status ||
        0}.svg`);
    },
    getStatusColor() {
      const status = this.$store.getters.user.status || 0
      return statuses[parseInt(status)].bgColor
    }
  }
};
</script>



<style scoped>
.profile-pic-outer{
  z-index:9999;
  display: flex;
}
.survay-button {
  padding: 10px;
  height: 24px;
  width: 24px;
}
.survay-inner {
  display: inline-block;
  box-shadow: 0px 0px 20px 3px cyan;
  border-radius: 50%;
}
.survay-button .material-icons {
  display: block;
  margin-left: -3px !important;
  margin-top: -3px !important;
  height: 24px;
  width: 24px;
  font-size: 30px;
  color: cyan;
}

.show-status-list-enter-active,
.show-status-list-leave-active {
  transition: 0.1s;
}
.show-status-list-enter,
.show-status-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.my-mini-information {
  border-radius: 10px;
  margin: 5px;
  height: 80px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  transition: 0.3s;
}

.profile-picture {
  margin-left: 10px;
  margin-right: 10px;
}

.information {
  color: white;
  margin-top: -7px;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.setting-icon {
  color: white;
  margin: auto;
  margin-right: 15px;
  padding: 5px;
  border-radius: 50%;
  cursor: default;
  user-select: none;
  transition: 0.3s;
}
.setting-icon:hover {
  background: rgba(0, 0, 0, 0.294);
}
.setting-icon .material-icons {
  display: block;
  margin: auto;
}
.status {
  display: inline-block;
  padding-top: 1px;
  padding-left: 5px;
  margin-left: 10px;
  margin-top: -2px;
  transition: 0.3s;
  user-select: none;
  border-radius: 10px;
}

.status:hover {
  background: rgba(26, 25, 25, 0.349);
}

.expand-status-icon {
  opacity: 0;
  transition: 0.3s;
}

.status:hover .expand-status-icon {
  opacity: 1;
}

.status .current-status {
  width: 20px;
  height: 20px;
  background-size: 100%;
  background-position: center;
}

.name {
  margin-top: 10px;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
}

.tag {
  color: rgb(199, 199, 199);
  font-size: 13px;
  display: inline-block;
  vertical-align: top;
  margin-top: 5px;
}
</style>
