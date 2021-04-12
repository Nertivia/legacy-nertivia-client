<template>
  <div class="my-mini-information">
    <ProfilePicture
      class="avatar"
      :avatar="avatar"
      :badges="user.badges"
      :id="user.id"
      size="35px"
      :hover="hover"
      @mouseenter.native="hover = true"
      @mouseleave.native="hover = false"
      @click.native="openUserInformation"
    />
    <div class="information">
      <div class="username-tag">
        <div class="username">{{ user.username }}</div>
        <div class="tag">:{{ user.tag }}</div>
      </div>
      <CustomStatus />
    </div>
    <!-- <div class="custom-status-button material-icons">
      edit
    </div> -->
    <div
      class="status-button"
      @click="status.isPoppedOut = !status.isPoppedOut"
    >
      <statusList
        class="status-popout"
        v-if="status.isPoppedOut"
        v-click-outside="closeMenus"
      />
      <img class="status" :src="getStatus" />
    </div>
  </div>
</template>

<script>
import { bus } from "../../main";
import statusList from "../../components/app/statusList.vue";
import CustomStatus from "../../components/app/CustomStatus.vue";
import settingsService from "@/services/settingsService";
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import statuses from "@/utils/statuses";
export default {
  components: {
    statusList,
    ProfilePicture,
    CustomStatus
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
      return this.$store.getters.user.avatar;
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
      this.$store.dispatch("setUserInformationPopout", this.user.id);
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
  height: 65px;
  padding-left: 5px;
  padding-right: 5px;
  transition: 0.3s;
  background: linear-gradient(
    137deg,
    rgba(133, 150, 255, 1) 0%,
    rgba(94, 200, 255, 1) 100%
  );
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px rgba(133, 150, 255, 1);
  margin: 5px;
}

.avatar {
  margin-left: 5px;
  margin-right: 5px;
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
    color: rgba(255, 255, 255, 0.72);
  }
}
.username-tag {
  display: flex;
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
  background: rgba(0, 0, 0, 0.2);
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
.custom-status-button {
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.8);
  &:hover {
    background: rgba(0, 0, 0, 0.3);
    color: white;
  }
}
</style>
