<template>
  <div class="my-mini-information">
    <ProfilePicture
      class="avatar"
      :url="`${avatar}${hover ? '' : '?type=webp'}`"
      :admin="user.admin"
      size="35px"
      :hover="true"
      @mouseenter.native="hover = true"
      @mouseleave.native="hover = false"
      @click.native="openUserInformation"
    />
    <div class="information">
      <div class="username">{{ user.username }}</div>
      <div class="tag">@{{ user.tag }}</div>
    </div>
    <div
      class="status-button"
      @click="status.isPoppedOut = !status.isPoppedOut"
    >
      <statusList
        v-if="status.isPoppedOut"
        v-click-outside="closeMenus"
        class="status-popout"
      />
      <img class="status" :src="getStatus" />
    </div>
  </div>
</template>

<script>
import { bus } from "../../main";
import config from "@/config.js";
import statusList from "../../components/app/statusList.vue";
import settingsService from "@/services/settingsService";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import statuses from "@/utils/statuses";

export default {
  components: {
    statusList,
    ProfilePicture
  },
  data() {
    return {
      status: {
        isPoppedOut: false
      },
      hover: false
    };
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
      const status = this.$store.getters.user.status || 0;
      return statuses[parseInt(status)].bgColor;
    }
  },
  created() {
    //When user changes their own status (statusList.vue)
    bus.$on("status-change", this.changeStatus);
  },
  beforeDestroy() {
    bus.$off("status-change", this.changeStatus);
  },
  methods: {
    openUserInformation() {
      this.$store.dispatch("setUserInformationPopout", this.user.uniqueID);
    },
    closeMenus(event) {
      if (event.target.closest(".status-button")) return;
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
      const { ok, result } = await settingsService.setStatus(status);
      if (ok && result.data.status == true) {
        this.$store.dispatch("changeStatus", result.data.set);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.my-mini-information {
  display: flex;
  position: relative;
  flex-shrink: 0;
  align-items: center;
  height: 50px;
  transition: 0.3s;
  background-color: rgba(0, 0, 0, 0.2);
}

.avatar {
  margin-left: 10px;
  flex-shrink: 0;
}

.information {
  display: flex;
  flex-direction: column;
  color: white;
  font-size: 14px;
  margin-left: 5px;
  overflow: hidden;
  flex: 1;
  .username,
  .tag {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tag {
    font-size: 13px;
    color: #b2d1d9;
  }
}

.status-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  transition: 0.2s;
  margin-left: 3px;
  margin-right: 5px;
  user-select: none;
  cursor: pointer;
  .status {
    height: 25px;
    width: 25px;
    flex-shrink: 0;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
